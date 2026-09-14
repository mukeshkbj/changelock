# ChangeLock

**Tagline:** Call the supplier before your company pays the scammer.

## Submission links

- Live judge demo: https://changelock.vercel.app
- Source: https://github.com/mukeshkbj/changelock
- CALL-E contribution PR: https://github.com/CALLE-AI/awesome-phone-call-agents/pull/613
- Demo video: [add public YouTube URL]
- CALL-E account email: [add account email]

## Inspiration

A vendor emails accounts payable with a routine request: “We changed banks. Send the next payment here.” If the mailbox was compromised, that small change can redirect an entire invoice run.

The recommended control is simple: call the supplier using a number the company already trusted, not the number inside the change request. In practice, callbacks are manual, inconsistently recorded, and easy to skip when a payment queue is moving quickly. ChangeLock turns that control into a bounded workflow.

## What it does

A normalized ERP event creates a held verification case. ChangeLock treats all contact details inside that event as attacker-controlled and resolves the callback destination only from the existing vendor-master record.

Before a call, the analyst sees the masked destination, the source of that trusted contact, and the exact CALL-E task. The task discloses automation, states a safe case code, and asks one question: did the supplier initiate this payment-instruction change? It forbids bank details, credentials, one-time passcodes, and payment links. A real call requires an exact authorization phrase and a consent attestation.

The returned result must pass local gates for call identity, intent, request hash, task and schema versions, trusted destination, completion state, supplier identity, case code, sensitive-data handling, opt-out, confidence, and supporting evidence. Missing or contradictory evidence fails closed.

A confirmation never updates banking data or releases a payment. It marks the request as independently verified evidence for a human. A denial records that the person reached through the trusted supplier number said the organization did not initiate the request. Every outcome leaves the payment change held.

## How we built it

ChangeLock is one strict TypeScript application built with Next.js, React, Zod, SQLite-compatible persistence, and the official `@call-e/calle` SDK.

The application reserves a durable intent before provider I/O. The idempotency key is derived from the approved request, trusted contact, bounded task, and schema version. If call creation becomes ambiguous, ChangeLock records `submission_unknown`, blocks redial, and allows an operator to reconcile an authoritative CALL-E call ID or escalate to human review.

Judge mode uses deterministic fixtures, but those fixtures pass through the same provider mapper, closed schema, evidence policy, state machine, persistence, and audit path as live results. Public deployment is structurally replay-only. Vercel functions use a Turso database through `@tursodatabase/serverless`; local and Docker runs use `@libsql/client` with a SQLite file.

The audit timeline stores masked, bounded evidence and links events by hash. It does not persist raw transcripts, complete phone numbers, bank-account numbers, routing numbers, or credentials.

## Challenges

The hardest problem was keeping evidence separate from authority. A plausible phone response cannot become permission to move money.

Phone-call creation also has an awkward failure mode: a network timeout may happen after the provider accepted the request. Retrying could call the supplier twice. ChangeLock therefore treats an unknown submission as its own durable state and never retries automatically.

The public deployment introduced another constraint. Local SQLite is not reliable across Vercel serverless requests, so we moved persistence behind an asynchronous Turso-compatible boundary and added race-safe initialization for concurrent cold starts. The public synthetic cases can be reset without touching vendor records or the permanently held change requests.

## Accomplishments

- The provider destination is loaded server-side from the trusted vendor-master contact; imported callback data cannot steer a call.
- Public judge mode cannot instantiate the live CALL-E path.
- Confirmed, denied, unreachable, malformed, sensitive-data, and ambiguous outcomes all pass through deterministic policy code.
- The database itself restricts payment-change status to `held`.
- The project has 138 passing unit and integration tests, a production build, a no-secrets check, Docker verification, mobile browser QA, and a live Vercel/Turso replay-and-reset smoke test.
- One authorized live CALL-E test reached no answer. ChangeLock correctly treated that as no proof either way and kept the request held. No retry was placed.

## What we learned

Making the phone call was the easy part. The work was deciding what the call could say, proving which number controlled the dial, surviving uncertain provider acceptance, and ensuring that “the AI said yes” could never become a payment instruction.

The useful artifact is not a transcript. It is a small piece of evidence with provenance, explicit limits, and a workflow that knows when to stop.

## What’s next

The next version would add authenticated ERP adapters, signed webhook verification, per-organization access controls, vendor-contact governance, and human-owned write-back proposals. It would still refuse to change bank details or release payments automatically.

## Built with

- CALL-E TypeScript SDK
- Next.js and React
- TypeScript
- Zod
- Turso Cloud and `@tursodatabase/serverless`
- `@libsql/client` for local SQLite
- Vitest
- Docker
- Vercel
