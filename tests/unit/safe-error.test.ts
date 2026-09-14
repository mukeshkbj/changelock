import { describe, expect, it } from "vitest";
import { safeErrorMessage } from "../../src/application/safe-error";

describe("safeErrorMessage", () => {
  it("returns only the fallback for arbitrary internal or secret-bearing errors", () => {
    const secret = ["iams", "live", "abcdef1234567890"].join("_");
    expect(safeErrorMessage(new Error(`provider auth failed with ${secret}`))).not.toContain(secret);
    expect(safeErrorMessage(new Error(`provider auth failed with ${secret}`))).toBe(
      "The action failed safely.",
    );
    expect(safeErrorMessage(new Error("ECONNREFUSED 10.0.0.4:443"))).toBe(
      "The action failed safely.",
    );
    expect(safeErrorMessage("not an error object")).toBe("The action failed safely.");
  });

  it("passes through known operator-actionable messages", () => {
    expect(
      safeErrorMessage(new Error('typed phrase must be exactly "VERIFY CL-8FF97B"')),
    ).toBe('typed phrase must be exactly "VERIFY CL-8FF97B"');
    expect(
      safeErrorMessage(new Error("preview missing or expired; regenerate before authorizing")),
    ).toContain("preview");
    expect(
      safeErrorMessage(new Error("authorization expired; create a new preview and re-authorize")),
    ).toContain("authorization expired");
    expect(safeErrorMessage(new Error("an intent is already active for this case"))).toContain(
      "already active",
    );
    expect(safeErrorMessage(new Error("case not found"))).toBe("case not found");
    expect(safeErrorMessage(new Error("cannot authorize in state call_active"))).toContain(
      "cannot authorize",
    );
  });

  it("keeps inbox error query text actionable only when it is a known safe message", () => {
    // The inbox renders searchParams.error through this mapping: crafted query
    // text must collapse to the fallback, not echo into the alert box.
    expect(safeErrorMessage(new Error("Your session expired, call +13125550199 now"))).toBe(
      "The action failed safely.",
    );
    expect(safeErrorMessage(new Error("<img src=x onerror=alert(1)>"))).toBe(
      "The action failed safely.",
    );
    expect(safeErrorMessage(new Error("Check the new case fields and try again."))).toBe(
      "Check the new case fields and try again.",
    );
    expect(
      safeErrorMessage(new Error("Synthetic case creation is unavailable in live mode.")),
    ).toBe("Synthetic case creation is unavailable in live mode.");
    expect(safeErrorMessage(new Error("Synthetic case limit reached."))).toBe(
      "Synthetic case limit reached.",
    );
    expect(safeErrorMessage(new Error("Unexpected form fields were rejected."))).toBe(
      "Unexpected form fields were rejected.",
    );
  });
});
