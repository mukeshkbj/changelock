import { afterEach, describe, expect, it } from "vitest";
import { parseJudgeCaseForm } from "../../src/application/live-input";
import { POST } from "../../src/app/api/cases/import/route";

const VALID = {
  vendorCode: "V-1002",
  sourceReference: "VMD-DEMO-001",
  requestContactName: "Synthetic Request Contact",
  lastFour: "4410",
};

function form(fields: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.append(k, v);
  return f;
}

describe("parseJudgeCaseForm", () => {
  it("accepts exactly the four judge form fields", () => {
    expect(parseJudgeCaseForm(form(VALID))).toEqual(VALID);
  });

  it.each([
    "phone",
    "requestContactPhone",
    "task",
    "providerMode",
    "callId",
    "externalEventId",
    "routingNumber",
    "bankAccount",
  ])("rejects crafted extra field %s", (extra) => {
    expect(() => parseJudgeCaseForm(form({ ...VALID, [extra]: "x" }))).toThrow(
      "Unexpected form fields were rejected.",
    );
  });

  it.each(["", "441", "44100", "44a0", " 441", "４４１０"])(
    "rejects invalid last four %j",
    (lastFour) => {
      expect(() => parseJudgeCaseForm(form({ ...VALID, lastFour }))).toThrow(
        "Check the new case fields and try again.",
      );
    },
  );

  it("rejects missing or empty required fields with the safe message", () => {
    for (const key of ["vendorCode", "sourceReference", "requestContactName"] as const) {
      const rest = { ...VALID, [key]: "" };
      expect(() => parseJudgeCaseForm(form(rest))).toThrow(
        "Check the new case fields and try again.",
      );
    }
  });
});

describe("POST /api/cases/import", () => {
  const ENV_KEYS = ["CHANGELOCK_MODE", "TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"] as const;
  const saved: Record<string, string | undefined> = {};

  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
      delete saved[k];
    }
  });

  it("refuses live mode before any database initialization", async () => {
    for (const k of ENV_KEYS) saved[k] = process.env[k];
    process.env.CHANGELOCK_MODE = "live";
    // Point at a remote URL with no token: if the route awaited getDb first,
    // initialization would throw instead of redirecting safely.
    process.env.TURSO_DATABASE_URL = "libsql://unreachable.example.turso.io";
    delete process.env.TURSO_AUTH_TOKEN;

    const res = await POST(
      new Request("http://localhost/api/cases/import", { method: "POST", body: form(VALID) }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "/?error=Synthetic%20case%20creation%20is%20unavailable%20in%20live%20mode.",
    );
  });
});
