import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DbClient } from "../../src/infrastructure/db";
import {
  getActiveTrustedContact,
  getCase,
  getChangeRequest,
  listIntentsForCase,
  openDatabase,
} from "../../src/infrastructure/db";
import { seedFixtures } from "../../src/fixtures/seed-data";
import { createJudgeCase } from "../../src/application/create-judge-case";
import { createPreview } from "../../src/application/create-preview";
import { authorizeIntent } from "../../src/application/authorize-intent";
import { resolveDispatchInput } from "../../src/application/resolve-dispatch-input";
import { isResettableSyntheticCase } from "../../src/application/reset-synthetic-case";
import { maskPhone } from "../../src/domain/redact";

let db: DbClient;
const ORIGINAL_MODE = process.env.CHANGELOCK_MODE;

const INPUT = {
  vendorCode: "V-1002",
  sourceReference: "VMD-DEMO-777",
  requestContactName: "Judge Operator",
  lastFour: "4410",
};

async function requestCount(): Promise<number> {
  const rs = await db.execute("SELECT COUNT(*) c FROM change_requests");
  return rs.rows[0].c as number;
}

beforeEach(async () => {
  db = await openDatabase(":memory:");
  await seedFixtures(db);
  process.env.CHANGELOCK_MODE = "replay";
});

afterEach(() => {
  db.close();
  if (ORIGINAL_MODE === undefined) delete process.env.CHANGELOCK_MODE;
  else process.env.CHANGELOCK_MODE = ORIGINAL_MODE;
});

describe("createJudgeCase", () => {
  it("persists one needs_review case with judge_manual provenance and a held request", async () => {
    const caseId = await createJudgeCase(db, INPUT);
    const kase = await getCase(db, caseId);
    expect(kase?.state).toBe("needs_review");

    const request = await getChangeRequest(db, kase!.changeRequestId);
    expect(request).not.toBeNull();
    expect(request!.status).toBe("held");
    expect(request!.sourceSystem).toBe("judge_manual");
    expect(request!.externalEventId).toMatch(/^judge-/);
    expect(request!.sourceReference).toBe("VMD-DEMO-777");
    expect(request!.requestContactName).toBe("Judge Operator");
    expect(request!.newDestinationLabel).toBe("bank account ending 4410");
    // The fixed reserved untrusted callback is stored masked — never raw.
    expect(request!.requestContactPhoneMasked).toBe(maskPhone("+12025550199"));
  });

  it("dispatch resolution uses the selected vendor's trusted contact, never the claimed one", async () => {
    const caseId = await createJudgeCase(db, INPUT);
    const kase = (await getCase(db, caseId))!;
    const request = await getChangeRequest(db, kase.changeRequestId);
    const trusted = await getActiveTrustedContact(db, request!.vendorId);
    expect(trusted).not.toBeNull();
    expect(trusted!.phoneE164).not.toBe("+12025550199");

    const preview = await createPreview(db, caseId);
    const intent = await authorizeIntent(db, {
      caseId,
      typedPhrase: `VERIFY ${kase.safeCaseCode}`,
      attestedConsentingContact: true,
      preview,
    });
    const callInput = await resolveDispatchInput(db, intent.id);
    expect(callInput.phoneE164).toBe(trusted!.phoneE164);
  });

  it("creates no call intent — no provider is involved in import", async () => {
    const caseId = await createJudgeCase(db, INPUT);
    expect(await listIntentsForCase(db, caseId)).toHaveLength(0);
  });

  it("rejects in live mode before any write", async () => {
    process.env.CHANGELOCK_MODE = "live";
    const before = await requestCount();
    await expect(createJudgeCase(db, INPUT)).rejects.toThrow(
      "Synthetic case creation is unavailable in live mode.",
    );
    expect(await requestCount()).toBe(before);
  });

  it("refuses the 51st synthetic case", async () => {
    for (let i = 0; i < 50; i += 1) {
      await createJudgeCase(db, { ...INPUT, sourceReference: `VMD-DEMO-${i}` });
    }
    await expect(createJudgeCase(db, INPUT)).rejects.toThrow("Synthetic case limit reached.");
  });

  it("rejects a bad last-four at the boundary without writing", async () => {
    const before = await requestCount();
    await expect(createJudgeCase(db, { ...INPUT, lastFour: "44a0" })).rejects.toThrow(
      "Check the new case fields and try again.",
    );
    await expect(createJudgeCase(db, { ...INPUT, phone: "+13125550199" })).rejects.toThrow(
      "Check the new case fields and try again.",
    );
    expect(await requestCount()).toBe(before);
  });

  it("rejects an unknown vendor code", async () => {
    await expect(createJudgeCase(db, { ...INPUT, vendorCode: "V-9999" })).rejects.toThrow(
      "unknown or inactive vendor code",
    );
  });

  it("is not resettable through the seeded-only synthetic reset", async () => {
    const caseId = await createJudgeCase(db, INPUT);
    const kase = (await getCase(db, caseId))!;
    const request = (await getChangeRequest(db, kase.changeRequestId))!;
    expect(isResettableSyntheticCase("verification_denied", request.externalEventId)).toBe(false);
  });
});
