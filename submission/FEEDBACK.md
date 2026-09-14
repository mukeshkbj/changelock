# Feedback for CALL-E (draft — Most Valuable Feedback category)

- `idempotencyKey` on `calls.create` is exactly right for payment-adjacent
  workflows; we reserve the key before any network I/O and it made safe retries
  trivial to reason about. Please document the dedupe window.
- `recipientResultSchema` + strict enum results made fail-closed evaluation
  clean. A documented "result rejected because extra fields" signal in the call
  object (rather than null structured_result) would help debug schema
  mismatches.
- `acceptance_unknown` is a real state: create() can fail after the call was
  accepted server-side. A documented "lookup by idempotency key" endpoint would
  let clients resolve ambiguous submission without risking a second call.
- `calls.get` for manual refresh works, but a first-class webhook signature
  verification helper in the SDK (beyond the event type) would shorten the safe
  path further.
- In two authorized live tests, calls remained queued across several polls.
  One resolved to `failed` / no answer; the other reached a person but ended
  after the greeting, before the verification question. Both returned useful
  `unable_to_verify` evidence. Clearer lifecycle guidance for queued calls and
  expected wait ranges would help operators distinguish normal delay from a
  stalled call without retrying.
- A UK destination was reported as unsupported during testing. A prominent,
  machine-readable country and region support matrix would let applications
  reject unsupported destinations before an operator authorizes a call.
- The completion_confidence score is useful as a gate input; documenting what
  "score" means (calibration, what it conditions on) would help us set
  thresholds defensibly.
- Minor: @gmail.com-only sign-in blocked non-gmail teammates during the hackathon
  window.
