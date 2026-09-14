# ChangeLock — Devpost draft

## Inspiration

Vendor bank-detail change fraud is the most expensive phone-call-shaped problem
in business email compromise: the FBI's IC3 reports billions in annual losses,
and the control every auditor recommends is boring — call the vendor back at the
number you already had on file. Companies skip it because it is manual, slow, and
awkward. ChangeLock makes that call automatic, bounded, and evidentiary.

## What it does

When an ERP emits a vendor payment-detail change request, ChangeLock:

1. Holds the request. Permanently — this app cannot approve anything.
2. Treats every callback detail inside the request as attacker-controlled.
3. Resolves the only number it will dial from the vendor master record.
4. Shows the analyst the exact bounded call contract and masked destination.
5. Requires an exact typed authorization phrase plus a consent attestation.
6. Places one CALL-E call that discloses automation, states a safe case code,
   asks only "did your organization initiate this change?", forbids bank
   details/credentials/OTPs, and stops on refusal.
7. Validates the result locally against a closed schema and a full gate list —
   bindings, terminal status, identity, case code, no sensitive data, no opt-out,
   answered question, confidence ≥ 0.70, evidence present.
8. Records a privacy-minimized, hash-chained audit trail.

Confirmed or denied is evidence for a human — never payment authority.

## How we built it

Next.js App Router + strict TypeScript, direct better-sqlite3 persistence, Zod at
external boundaries, deterministic content-bound fingerprints and idempotency
keys, and a `CallProvider` seam with a replay provider (zero network, zero secret
reads) and a narrow official `@call-e/calle` SDK adapter behind server-only
`CHANGELOCK_MODE=live` plus an explicit contact allowlist.

## What we learned

The hard part is not making a phone call — it is making sure nothing attacker-
controlled can steer one, and that "the AI said it was fine" can never become an
approval.

## What's next

Webhook-verified callbacks, vendor-master write-back proposals (still
human-approved), and outcome statistics per vendor.
