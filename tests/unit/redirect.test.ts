import { describe, expect, it } from "vitest";
import { redirectTo, redirectToCase } from "../../src/app/api/cases/[id]/_shared";

describe("redirectToCase", () => {
  it("emits a relative Location so proxies and port mappings keep the public origin", () => {
    const res = redirectToCase("case_1");
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/cases/case_1");
  });

  it("encodes safe error text into the query string", () => {
    const res = redirectToCase("case_1", "live mode is not enabled on this server");
    expect(res.headers.get("location")).toBe(
      "/cases/case_1?error=live%20mode%20is%20not%20enabled%20on%20this%20server",
    );
  });
});

describe("redirectTo", () => {
  it("emits a relative Location for the inbox error path", () => {
    const res = redirectTo("/", "Synthetic case limit reached.");
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "/?error=Synthetic%20case%20limit%20reached.",
    );
  });

  it("redirects to the new case on success without an error param", () => {
    const res = redirectTo("/cases/case_new");
    expect(res.headers.get("location")).toBe("/cases/case_new");
  });

  it.each([
    "//evil.example.com",
    "/\\evil.example.com",
    "https://evil.example.com",
    "\\\\evil.example.com",
    "evil.example.com",
    "",
    "cases/case_1",
  ])("rejects non-root-relative path %j", (path) => {
    expect(() => redirectTo(path)).toThrow("redirect target must be a root-relative path");
  });

  it.each(["/", "/cases/case_1", "/cases/case_1?error=x", "/inbox/held%20cases"])(
    "accepts root-relative path %j",
    (path) => {
      expect(redirectTo(path).headers.get("location")).toBe(path);
    },
  );
});
