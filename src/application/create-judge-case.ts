import { randomUUID } from "node:crypto";
import { z } from "zod";
import { now, type Db } from "../infrastructure/db";
import {
  importChangeRequest,
  SourceSystemLimitError,
} from "./import-change-request";

// Judge-facing "add synthetic case" boundary. The form only ever supplies a
// vendor, a source reference, a request contact name, and four claimed
// destination digits — no phone number, event id, task, provider mode, call
// id, or bank/routing field can enter through this path.
export const JUDGE_FIELDS_ERROR = "Check the new case fields and try again.";
export const JUDGE_SOURCE_SYSTEM = "judge_manual";
export const JUDGE_CASE_LIMIT = 50;
// Reserved fictional callback in the +1 202-555-01xx range; it is stored
// masked like every other untrusted request contact and is never dialed.
const JUDGE_CLAIMED_PHONE = "+12025550199";

const judgeCaseSchema = z
  .object({
    vendorCode: z.string().min(1).max(64),
    sourceReference: z.string().min(1).max(128),
    requestContactName: z.string().min(1).max(120),
    lastFour: z.string().regex(/^\d{4}$/),
  })
  .strict();

export type JudgeCaseInput = z.infer<typeof judgeCaseSchema>;

export function parseJudgeCaseInput(raw: unknown): JudgeCaseInput {
  const parsed = judgeCaseSchema.safeParse(raw);
  if (!parsed.success) throw new Error(JUDGE_FIELDS_ERROR);
  return parsed.data;
}

// Creates a fictional replay-only case for judges: same import pipeline and
// held invariant as ERP events, provenance-tagged so it is never resettable
// through the seeded-only reset action. The per-source ceiling is enforced
// inside the atomic import batch, so concurrent creations cannot overshoot
// it on a shared database. No CALL-E provider is touched here — a real call
// still requires the normal preview/authorize/dispatch flow.
export async function createJudgeCase(db: Db, raw: unknown): Promise<string> {
  const input = parseJudgeCaseInput(raw);
  if (process.env.CHANGELOCK_MODE === "live") {
    throw new Error("Synthetic case creation is unavailable in live mode.");
  }
  let result;
  try {
    result = await importChangeRequest(
      db,
      {
        externalEventId: `judge-${randomUUID()}`,
        vendorCode: input.vendorCode,
        requestedAt: now(),
        sourceSystem: JUDGE_SOURCE_SYSTEM,
        sourceReference: input.sourceReference,
        requestContactName: input.requestContactName,
        requestContactPhone: JUDGE_CLAIMED_PHONE,
        newDestinationLabel: `bank account ending ${input.lastFour}`,
      },
      { sourceSystemLimit: JUDGE_CASE_LIMIT },
    );
  } catch (err) {
    if (err instanceof SourceSystemLimitError) {
      throw new Error("Synthetic case limit reached.");
    }
    throw err;
  }
  return result.verificationCase.id;
}
