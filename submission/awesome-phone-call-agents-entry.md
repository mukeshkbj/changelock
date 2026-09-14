# ChangeLock

**One-line:** Accounts-payable fraud command center — CALL-E independently
verifies vendor payment-detail change requests by calling the vendor's trusted
on-file contact, and turns the answer into evidence (never approval).

**Problem:** Vendor bank-detail change requests are the top BEC/FBI-IC3 loss
vector. The recommended control is an out-of-band phone call to a number already
on file; ChangeLock automates exactly that call and nothing else.

**Call flow:** A normalized ERP change event creates a held verification case.
An analyst reviews the bounded call contract (automation disclosure, safe case
code, one yes/no question, no bank details/credentials/OTPs, stop on refusal, no
approval implied), types `VERIFY <CASE_CODE>`, attests the destination is a
consenting on-record contact, and one call goes out to the trusted vendor-master
number — never the number in the request.

**CALL-E usage:** `calls.create` with a content-bound `idempotencyKey` and a
closed `recipientResultSchema`; `calls.get` for manual refresh. Results are
re-validated locally through a full gate list (bindings, terminal status, closed
schema, identity, case code, sensitive-data check, opt-out, confidence ≥ 0.70,
evidence). Ambiguous submission parks the case in `submission_unknown` and never
auto-retries.

**Guardrails:** imported callback data is untrusted and never dialed; dispatch
accepts only an intentId; full phone numbers are never rendered; no transcript or
bank data is persisted; the payment change stays `held` under every outcome.

**Demo:** `npm install && npm run dev` — judge replay mode runs deterministic
offline fixtures through the same parser and gates as live results. No
credentials needed.
