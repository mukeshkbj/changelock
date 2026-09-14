# Demo script (~3 minutes)

0. (0:00–0:15) Inbox. "Four vendor payment-change requests. Every one is held —
   this system can never approve a payment change."

1. (0:15–0:45) Open the Northstar case. Point at the trust rail:
   - UNTRUSTED REQUEST: the name and number inside the request itself — treated
     as attacker-controlled, masked, never dialed.
   - INDEPENDENT CALLBACK: the trusted contact from the vendor master — the only
     number ChangeLock will ever call.
   - EVIDENCE ONLY: whatever the call learns, the payment stays held.

2. (0:45–1:10) The bounded call contract panel. Read it aloud once: automation
   disclosure, one question, no bank details, no credentials, no OTPs, stops on
   refusal, "this call does not approve anything."

3. (1:10–1:40) Run the "Denied — not initiated" replay: pick the scenario, type
   `VERIFY <code>`, tick the attestation, submit. Show the red verified-denied
   state — "the vendor says they never asked. The request stays held; an analyst
   gets the evidence."

4. (1:40–2:10) Open another case, run "Confirmed". Green verified evidence — and
   point out the payment is STILL held. "Confirmed is evidence, not approval."

5. (2:10–2:35) Show the gates panel and audit timeline: every gate that must
   pass, the hash-linked event chain, masked numbers everywhere. Optionally run
   "Sensitive data leaked" or "Malformed result" to show fail-closed behavior.

6. (2:35–3:00) Close: "One bounded question, to the number you already trusted,
   producing evidence a human can act on. That is the whole product — and it is
   exactly the phone call auditors keep telling companies to make."

Note for judges: the demo runs deterministic offline fixtures through the same
mapper/evaluator as live results. No live calls are placed and none are claimed.
