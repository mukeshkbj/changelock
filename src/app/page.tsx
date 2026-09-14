import Link from "next/link";
import { getDb } from "./server/get-db";
import { listInbox } from "./server/queries";
import { listActiveVendors } from "../infrastructure/db";
import { safeErrorMessage } from "../application/safe-error";

export const dynamic = "force-dynamic";

const STATE_LABEL: Record<string, string> = {
  needs_review: "Needs review",
  preview_ready: "Preview ready",
  dispatch_reserved: "Dispatch reserved",
  submission_unknown: "Submission unknown",
  call_active: "Call active",
  terminal_unverified: "Terminal · unverified",
  verification_confirmed: "Verified initiated",
  verification_denied: "Verified not initiated",
  needs_human: "Needs human",
};

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const db = await getDb();
  const [rows, vendors] = await Promise.all([listInbox(db), listActiveVendors(db)]);
  return (
    <main>
      <div className="inbox-head">
        <h1>Held payment-change requests</h1>
        <span className="muted">
          {rows.length} case{rows.length === 1 ? "" : "s"} · every request stays held until evidence
          resolves
        </span>
      </div>
      {error ? (
        <div className="error-box" role="alert">
          {safeErrorMessage(new Error(error))}
        </div>
      ) : null}
      <details className="judge-case">
        <summary>Add synthetic test case</summary>
        <p className="muted judge-case-note">
          Creates a fictional replay-only case for evaluation. It cannot place a call — a real
          call would still need the trusted vendor contact and operator authorization.
        </p>
        <form method="post" action="/api/cases/import" className="judge-case-form">
          <div className="field">
            <label htmlFor="jc-vendor">Vendor</label>
            <select id="jc-vendor" name="vendorCode" required>
              {vendors.map((v) => (
                <option key={v.id} value={v.vendorCode}>
                  {v.displayName} ({v.vendorCode})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="jc-ref">Source reference</label>
            <input
              id="jc-ref"
              name="sourceReference"
              type="text"
              defaultValue="VMD-DEMO-001"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="jc-name">Request contact name</label>
            <input
              id="jc-name"
              name="requestContactName"
              type="text"
              defaultValue="Synthetic Request Contact"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="jc-last4">Claimed destination — last four digits</label>
            <input
              id="jc-last4"
              name="lastFour"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Create held case
          </button>
        </form>
      </details>
      {rows.length === 0 ? (
        <p className="empty-note">No change requests imported yet.</p>
      ) : (
        <div className="table-scroll">
        <table className="case-table">
          <thead>
            <tr>
              <th>Case</th>
              <th>Vendor</th>
              <th>Requested change</th>
              <th>Received</th>
              <th>Verification state</th>
              <th>Payment change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.caseId}>
                <td>
                  <Link href={`/cases/${r.caseId}`} className="mono">
                    {r.safeCaseCode}
                  </Link>
                </td>
                <td>
                  <Link href={`/cases/${r.caseId}`}>{r.vendorName}</Link>
                  <div className="muted mono">{r.vendorCode}</div>
                </td>
                <td className="muted">{r.newDestinationLabel}</td>
                <td className="muted mono">
                  {new Date(r.requestedAt).toISOString().slice(0, 16).replace("T", " ")}
                </td>
                <td>
                  <span className={`state-badge ${r.state}`}>{STATE_LABEL[r.state] ?? r.state}</span>
                </td>
                <td>
                  <span className="held-marker">Held</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </main>
  );
}
