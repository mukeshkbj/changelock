import { z } from "zod";
import {
  getCaseByRequestId,
  getChangeRequestByExternalEventId,
  getVendorByCode,
  insertImportBundle,
  newId,
  now,
  type Db,
} from "../infrastructure/db";
import { changeFingerprint, generateSafeCaseCode } from "../domain/fingerprint";
import { isE164, maskPhone } from "../domain/redact";
import type { ChangeRequest, VerificationCase } from "../domain/types";

const erpEventSchema = z
  .object({
    externalEventId: z.string().min(1).max(128),
    vendorCode: z.string().min(1).max(64),
    requestedAt: z.string().min(4).max(64),
    sourceSystem: z.string().min(1).max(64),
    sourceReference: z.string().min(1).max(128),
    requestContactName: z.string().min(1).max(120),
    requestContactPhone: z.string().min(1).max(64),
    newDestinationLabel: z.string().min(1).max(120),
  })
  .strict();

export interface ImportResult {
  changeRequest: ChangeRequest;
  verificationCase: VerificationCase;
  duplicate: boolean;
}

export interface ImportOptions {
  // Optional per-source-system ceiling enforced atomically inside the write
  // batch (the judge synthetic-case path uses it; ERP/seed imports omit it
  // and stay unlimited).
  sourceSystemLimit?: number;
}

// Thrown when a sourceSystemLimit-guarded insert no-ops: the request row
// never landed and no existing row matches the event id.
export class SourceSystemLimitError extends Error {
  constructor() {
    super("source system import limit reached");
    this.name = "SourceSystemLimitError";
  }
}

export async function importChangeRequest(
  db: Db,
  raw: unknown,
  options: ImportOptions = {},
): Promise<ImportResult> {
  const event = erpEventSchema.parse(raw);
  const vendor = await getVendorByCode(db, event.vendorCode);
  if (!vendor || vendor.status !== "active") {
    throw new Error("unknown or inactive vendor code");
  }

  const existing = await getChangeRequestByExternalEventId(db, event.externalEventId);
  if (existing) {
    const verificationCase = await getCaseByRequestId(db, existing.id);
    if (!verificationCase) throw new Error("orphaned change request");
    return { changeRequest: existing, verificationCase, duplicate: true };
  }

  const request: ChangeRequest = {
    id: newId("cr"),
    externalEventId: event.externalEventId,
    vendorId: vendor.id,
    requestedAt: event.requestedAt,
    sourceSystem: event.sourceSystem,
    sourceReference: event.sourceReference,
    requestContactName: event.requestContactName,
    requestContactPhoneMasked: isE164(event.requestContactPhone)
      ? maskPhone(event.requestContactPhone)
      : "(not a phone number)",
    newDestinationLabel: event.newDestinationLabel,
    changeFingerprint: changeFingerprint({
      vendorId: vendor.id,
      destinationDescriptor: event.newDestinationLabel,
    }),
    status: "held",
  };
  const verificationCase: VerificationCase = {
    id: newId("case"),
    changeRequestId: request.id,
    state: "needs_review",
    safeCaseCode: generateSafeCaseCode(),
    currentIntentId: null,
    createdAt: now(),
    updatedAt: now(),
  };

  // One atomic write batch whose statements are self-guarding: a racing
  // initializer running the identical batch writes nothing, so no window
  // exists where a loser could observe a request without its case or fork a
  // second audit chain. Afterwards we read the persisted rows back — the
  // winner's ids win, so `duplicate` is decided by the stored row, not by
  // which client happened to insert.
  await insertImportBundle(db, request, verificationCase, [
    {
      type: "change_request.imported",
      actor: "erp_import",
      payload: {
        externalEventId: event.externalEventId,
        vendorCode: vendor.vendorCode,
        sourceSystem: event.sourceSystem,
        sourceReference: event.sourceReference,
        requestContactPhone: request.requestContactPhoneMasked,
        requestContactTrusted: false,
        changeFingerprint: request.changeFingerprint,
        status: "held",
      },
    },
    {
      type: "case.created",
      actor: "system",
      payload: { safeCaseCode: verificationCase.safeCaseCode, state: "needs_review" },
    },
  ], options.sourceSystemLimit);

  const persisted = await getChangeRequestByExternalEventId(db, event.externalEventId);
  if (!persisted) {
    // A guarded batch no-ops when the source-system ceiling is already met.
    if (options.sourceSystemLimit !== undefined) throw new SourceSystemLimitError();
    throw new Error("change request was not persisted");
  }
  const persistedCase = await getCaseByRequestId(db, persisted.id);
  if (!persistedCase) throw new Error("orphaned change request");
  return {
    changeRequest: persisted,
    verificationCase: persistedCase,
    duplicate: persisted.id !== request.id,
  };
}
