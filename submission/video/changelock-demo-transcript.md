# ChangeLock demo transcript (~2:55)

Narrative authority: `submission/DEMO_SCRIPT.md`. All scenarios shown are
**deterministic replay fixtures** — no live calls are placed in this video.
The single mention of a live call (segment 9) truthfully states that one real
authorized test call reached **no answer**, which is not proof of confirmation
or denial.

| Time | Beat | Narration |
|------|------|-----------|
| 0:01–0:12 | Title / replay disclosure | This is ChangeLock, a verification checkpoint for vendor bank-detail changes. Everything you are about to see is deterministic replay. No live calls are placed, and none are claimed. |
| 0:14–0:24 | Inbox, four held requests | Four vendor payment-change requests sit in the inbox. Every one of them is held, because ChangeLock can never approve a payment change, only verify the story behind it. |
| 0:25–0:52 | Northstar trust rail | Open the Northstar case, and the trust rail tells the whole story. On the left, the untrusted request, the name and number inside the request itself, treated as attacker-controlled, masked, and never dialed. In the middle, the independent callback: the trusted contact already in the vendor master. That is the only number ChangeLock will ever call. On the right, evidence only: whatever the call learns, the payment stays held. |
| 0:53–1:13 | Bounded call contract | The call itself is a bounded contract. An automation disclosure up front. One question: did you request this change. No bank details. No credentials. No one-time passcodes. It stops on refusal. And it closes with the line that matters: this call does not approve anything. |
| 1:14–1:24 | Authorization form | Before anything runs, a human authorizes it. The operator picks the scenario, types the case verification phrase, and attests that the contact consented to a callback. |
| 1:25–1:39 | Denied replay result | Here the replay comes back denied. The vendor says they never asked for this change. The denial is recorded as evidence, bound to this request. And the payment change stays held. An analyst now has proof, not a hunch. |
| 1:40–1:55 | Binding gates | Every result must pass binding gates: the same call, the same intent, the same request hash, the same task and schema versions, the same trusted destination. If any gate fails, the result is rejected and the case fails closed. |
| 1:56–2:11 | Confirmed replay, still held | On a second case, the replay comes back confirmed. Green evidence; the vendor did request it. And notice: the payment change is still held. Confirmed is evidence, not approval. A human decides what happens next. |
| 2:12–2:30 | Fail-closed + honest live mention | And when verification cannot complete, unreachable, malformed, ambiguous, ChangeLock fails closed. In our own local live test, one real authorized call was placed to a consented test contact; it reached no answer. No answer is not proof either way. The request stayed held. |
| 2:31–2:39 | Audit timeline | Behind it all, a hash-linked audit timeline records every action, every gate, every masked number: evidence an auditor can replay. |
| 2:42–2:54 | Close | One bounded question, to the number you already trusted, producing evidence a human can act on. That is the whole product: the call auditors keep telling companies to make, finally enforced by the system itself. |
