import { safeErrorMessage } from "../../../../application/safe-error";

// Root-relative Location only: req.url reflects the server's listen address,
// not the public Host/X-Forwarded-Host, so an absolute URL would strand judges
// behind proxies or port mappings. Browsers resolve a relative redirect
// against the request origin, which keeps deployments on any host or port
// working. The path guard also rejects protocol-relative ("//host") and
// backslash-normalized ("/\host") values so a Location can never leave origin.
export function redirectTo(path: string, error?: string): Response {
  if (path !== "/" && !/^\/[^/\\]/.test(path)) {
    throw new Error("redirect target must be a root-relative path");
  }
  let location = path;
  if (error) location += `?error=${encodeURIComponent(error)}`;
  return new Response(null, { status: 303, headers: { Location: location } });
}

export function redirectToCase(caseId: string, error?: string): Response {
  return redirectTo(`/cases/${caseId}`, error);
}

export function errMessage(err: unknown): string {
  return safeErrorMessage(err);
}
