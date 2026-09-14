# CALL-E: Your Code Is Calling — Hackathon Research

Compiled: 2026-09-13 (UTC). All facts below cite primary/official sources (Devpost hackathon pages, official rules, CALL-E GitHub org, CALL-E docs site, heycall-e.com) plus primary studies/agency reports for market-scale evidence. Sections marked **"Observed competition"** and **"Analysis"** are inference, not official fact.

---

## 1. Hackathon Snapshot

| Item | Fact | Source |
|---|---|---|
| Name | CALL-E: Your Code Is Calling — "Turn your code into an AI agent that makes real phone calls" | call-e.devpost.com |
| Host / Sponsor | AIRUDDER Pte Ltd (Singapore; CALL-E / AI Rudder) | Official Rules §2 |
| Format | Online, public | call-e.devpost.com |
| Participants | ~3,171 registered (as of 2026-09-13) | call-e.devpost.com header |
| **Submission deadline** | **Sep 14, 2026, 11:45 pm SGT** (= Sep 14, 2026, 3:45 pm UTC). At research time (Sep 13, ~16:00 UTC) roughly **24 hours remain**. | Overview + Rules §1 |
| Feedback period | Jul 23 – Sep 18, 2026, 11:45 pm SGT | Rules §1 |
| Judging period | Sep 30 – Oct 13, 2026 (SGT) | Rules §1 |
| Winners announced | On or around Oct 19, 2026, 2:00 pm SGT | Rules §1 |
| Total cash | $10,000 | Overview |

### Eligibility (Rules §3)
- Open to individuals at/above the age of majority in their country of residence, teams of eligible individuals, and registered organizations.
- Individuals may join multiple teams and may also enter individually.
- A team/organization must appoint one authorized **Representative** to submit.
- **Not open to** residents/organizations where US or local law prohibits participation or prizes — explicitly including Brazil, Quebec, Russia, Crimea, Cuba, Iran, North Korea, and OFAC-comprehensively-sanctioned countries; also excludes Sponsor/Admin employees, judges, their families/households, and affiliates.

### Team size
- **No maximum team size is stated anywhere in the official rules or submission requirements.** Teams and organizations are permitted; there is no numeric cap. (Verified by reading the full rules text; treat "unlimited team size" as rules-silent, not officially affirmed.)

### Prizes (Overview + Rules §8)
| Prize | Cash | Qty | Extras |
|---|---|---|---|
| Most Practical Use Case | $4,000 | 1 | CALL-E team meeting, blog feature, 20,000 CALL-E credits (~$200) |
| Most Innovative Use Case | $3,000 | 1 | Same extras + 20,000 credits |
| Honorable Mention | $1,000 | 2 | Meeting + blog feature + 10,000 credits (~$100) |
| Most Valuable Feedback | $200 | 5 | 10,000 credits; awarded to individuals, not projects; requires completing the CALL-E Feedback Survey during the Feedback Period; one per entrant |

- A project can win only one prize. Feedback-prize-only entrants aren't eligible for other prizes.
- Prize delivery requires winner affidavits/forms (10 business days to return; payment within 60 days); US W-9 / non-US W-8BEN may be required. Winners bear taxes/wire fees.
- Judges listed: Ren Teng (CEO, AI Rudder), Bianca Cheng (CMO/CRO, AI Rudder), Yechang Hu (PM, CALL-E), Betty Paul (Head of GTM, AI Rudder). Judges may change.

### Judging (Rules §6 + Overview)
Two stages:
1. **Stage One (pass/fail):** baseline viability — project fits theme and reasonably applies CALL-E APIs, SDKs, MCP, or Skill integrations.
2. **Stage Two:** four **equally weighted** criteria:
   - **Real World Impact** — a real, specific phone-work problem credibly solved for real users; not a generic "AI that makes phone calls."
   - **Quality of the Idea** — creative, non-obvious use; clear, well-scoped, community-reusable contribution.
   - **Technical Implementation** — CALL-E imported and **actually called at runtime**, not just referenced; working, non-trivial implementation.
   - **Product Experience & Demo** — complete, coherent experience; demo video clearly communicates what it does and why.
- Ties broken by sequential criterion scores, then judge vote.
- Feedback submissions judged on completeness, viability, potential impact.

### What to build / submit (Overview + Rules §4)
- Functional software using CALL-E's API, Python/TypeScript SDKs, Skill, or MCP on agent environments (Codex, ChatGPT, Claude Code, etc.) for a business/project use case. Functional app, agent skill, workflow plugin, or other reusable contribution all acceptable.
- **Mandatory:** open a pull request to `github.com/CALLE-AI/awesome-phone-call-agents` into the correct contribution area (Agent Skills / Workflow Plugins / Apps per its README), and put the PR URL on the Devpost submission form.
- **Mandatory:** text description of features/functionality; demo video **< 3 minutes**, publicly visible on YouTube or Vimeo, showing the project working; CALL-E account email.
- **Optional:** live demo URL (if private, include credentials in testing instructions); feedback survey for the MVF prizes.
- Judges not required to test the project — they may judge on description/images/video alone. Project must remain free and available for testing until the Judging Period ends.
- New or significantly-updated-since-Jul-23 projects only; explain the update if pre-existing. Third-party SDKs/APIs must be properly licensed/authorized.
- Multiple submissions allowed if substantially different. Submission must be original work solely owned by entrant; open-source components allowed if licenses honored and the entry builds on them.
- All submission materials in English (or with English translation).
- Projects developed with Sponsor/Admin funding or commercial license are ineligible.
- IP stays with the entrant; Sponsor gets a non-exclusive judging license and 3-year promotional rights over submission materials and contributor name/likeness.
- After the deadline, submissions freeze (portfolio can still be updated; content edits only via Sponsor for rights/privacy issues).
- Disputes: binding AAA arbitration, New York law. Official Rules control over any conflicting marketing copy.

### Key hackathon links
- Overview: https://call-e.devpost.com/
- Official Rules: https://call-e.devpost.com/rules
- Resources: https://call-e.devpost.com/resources
- Feedback form page: https://call-e.devpost.com/details/feedback
- Submission repo (PRs = submissions): https://github.com/CALLE-AI/awesome-phone-call-agents
- Setup repo: https://github.com/CALLE-AI/call-e-integrations
- Extra-calls request form: https://forms.gle/EPQttEZ1rkW8iq9q6 (linked from rules/README; rules text mentions up to 200 additional calls, processed in ~1–5 business days, subject to availability/discretion)
- Discord: https://discord.gg/6AbXUzUV8w (support channel per Resources page; heycall-e.com also lists discord.gg/SDcGdhgRzj)

---

## 2. CALL-E Platform

CALL-E = goal-driven outbound phone-call agent platform from AI Rudder. You give a goal + phone number; it plans, clarifies missing details, dials, converses naturally, handles voicemail/IVR/holds, and returns a schema-validated structured result + transcript + summary + evidence + completion confidence.

### Integration paths (official: github.com/CALLE-AI/call-e-integrations)
- **SDKs:** TypeScript `@call-e/calle` (npm/pnpm) and Python `calle-ai` (pip). Server-side only. `client.calls.createAndWait({task, resultSchema})` etc.
- **Developer API:** base `https://api.heycall-e.com`; `POST /v1/calls` (single or batch recipients, `Idempotency-Key`, `result_schema`, `recipient_result_schema`, `metadata`, `webhook_url`), `GET /v1/calls/{id}`, `GET /v1/calls/{id}/events`, `POST /calle/webhook` for terminal-result webhooks. OpenAPI spec: https://docs.heycall-e.com/openapi/calle.openapi.yaml
- **MCP:** Streamable HTTP endpoint `https://seleven-mcp-sg.airudder.com/mcp/openagent_oauth`, OAuth-authorized, exactly three tools: `plan_call` (creates plan, returns `plan_id` + `confirm_token`), `run_call` (places the real call; requires exact plan_id/token), `get_call_run` (poll status/activity/transcript; wait ~60s after start, then poll every 5–10s; `run_call` has **no webhook support** — poll only; persist `run_id`, never re-call `run_call`).
- **CLI:** `calle` (`@call-e/cli`, npm) — `auth login`, `auth status`, `mcp tools`, `call plan/...` commands; shared auth/token cache used by all agent plugins. `--no-telemetry` opt-out.
- **SKILL / agent plugins:** Codex plugin (`$calle`), Claude Code plugin (`/calle:calle`), Cursor plugin (MCP config + `calle` skill + safety rule), OpenClaw skill on ClawHub (`openclaw skills install phone-call-calle`), Hermes via ClawHub prompt, portable `skills/calle/` for any skills.sh agent (`npx skills add ...`). ChatGPT app-store integration and WhatsApp entry point are also advertised on heycall-e.com.
- **Goals & Goal Runs:** reusable published call workflows authored in CALL-E Chat/dashboard; `GET /v1/goals` lists them; a Goal Run supplies one E.164 number + variables + idempotency key. Use `/v1/calls` for one-off tasks with request-scoped schemas.
- **Examples:** `examples/mcp-oauth-client`, `examples/mcp-broker-client`, `examples/python-batch-runner` (JSONL batch via FastMCP). Docs repo tree: `docs/install/install-guide.md`, `docs/install/troubleshooting.md`, `docs/mcp/openagent-oauth.md`, `packages/cli/docs/cli-reference.md`.

### Capabilities (official README)
Live task progress; smart goal clarification; managed dialing; structured schema-validated results; scheduled & batch calling; in-task optimization across attempts; real-world voice handling (voicemail, screening, hold, transfers, silence, interruptions); IVR navigation with DTMF; number governance, rate limits, concurrency controls, blocklists, kill switches, redacted logs, audit trails.
**In development (not GA):** Goal-Driven Long Tasks (multi-step autonomous campaigns that learn across calls).

### Limitations / gotchas (official sources)
- **Outbound only via dev API:** "CALL-E does not currently provide Developer API endpoints for inbound calling" — inbound requires dashboard-purchased numbers and Inbound Goals (docs.heycall-e.com/goal-runs). Inbound-heavy concepts can't be built purely on the dev API.
- **Region gating:** a valid E.164 number can still be rejected with `unsupported_region`. ~45 supported countries; "Local" line countries (US, SG, MY, AE, AU, MX, BR) get local caller lines; "International" countries are dialed from CALL-E international numbers "primarily intended for testing" — production local lines require contacting the CALL-E team. Full table: README "Supported Regions and Languages".
- **MCP `run_call` has no webhook; ~60s initial poll delay is a recommendation, not a completion SLA.**
- **Accounts:** new accounts get **20 free calls**; running out just pauses access (no auto-charge); additional hackathon calls via the form. Flat pricing per heycall-e.com FAQ: **$0.05 per billable call** (early-stage pricing, "not final"). Prize credits imply ~$0.01/credit valuation.
- **Temporary sign-in restriction (as of ~Sep 6–9, 2026):** official Devpost forum response says recent attacks triggered temporary risk controls — **accounts currently must be @gmail.com** and sign in via "Continue with Google" at dashboard.heycall-e.com/login; support@heycall-e.com for remaining issues. Several participants also reported infra/tool-behavior regressions during that window.
- **Own-number/SIP:** can't usually link an existing personal number; numbers can be purchased on-platform; SIP trunking is a B2B path. Outbound activation may require KYC depending on region (heycall-e.com FAQ).
- **Safety rules baked into integrations:** must plan first, preserve `plan_id`/`confirm_token` verbatim, only run a call on clear user intent; never expose tokens (install guide "Safety").
- **CLI telemetry** collects anonymous install/usage events (not phone numbers, transcripts, tokens); opt out with `--no-telemetry`.
- **API key format:** `iams_live_...` project keys from dashboard.heycall-e.com/account/api-keys; server-side only; `CALLE_API_KEY`/`CALLE_BASE_URL` env vars; 401/403 semantics documented; keep keys out of browsers.

### Docs / references
- Docs hub: https://docs.heycall-e.com/ (quickstart, authentication, calls, goal-runs, webhooks, errors, SDKs, regions)
- Product: https://www.heycall-e.com/ (SOC 2 / ISO 27001 / GDPR / PDPA / IMDA / CSA claims)
- Dashboard: https://dashboard.heycall-e.com/
- Devpost build session video: https://www.youtube.com/watch?v=qzHIFuZkCik ("From One-Shot Calls to Long Task Goals", Vadim Smirnov demo of SDK/API/goals)

---

## 3. Observed competition (NOT official fact — inference from public artifacts)

The Devpost **project gallery is not published** ("hackathon managers haven't published this gallery yet"), so submissions can't be browsed on Devpost. However, the rules require every submission to open a PR against **CALLE-AI/awesome-phone-call-agents**, which makes that repo a de-facto public submission feed:

- **PR volume (as of 2026-09-13): 172 open + 270 closed ≈ 440 PRs**, with ~30 PRs opened on Sep 13 alone — i.e., a last-minute submission rush. 392 forks, 89 stars. Source: https://github.com/CALLE-AI/awesome-phone-call-agents/pulls
- The repo README's "Resource list" enumerates merged contributions: **~47 skills, ~70 apps, 5 plugins**, plus ~20 safety-pattern docs.

**Clearly crowded categories** (multiple existing entries each):
- Appointment confirmation / callback & scheduling orchestration (appointment-confirm, slotsaver PR, multi-party-scheduler, callback-window-coordinator, candidate-availability-call, lead-follow-up-booking)
- Healthcare: post-discharge/visit follow-ups, elder check-ins, claim-status, lab results, pharmacy price, care-access watch (aftercare, careloop-ai, metapelet, holdfor-post-visit, kol/kol-ivr-route, labline, pharmacy-cash-price, sticker, openings, rdn-intake)
- Verification / evidence-gated / consent-first "prove it on the transcript" patterns — arguably the single most crowded meta-pattern (verify-by-phone, verify-contact-claim, verity-verification-core, call-state-reconciler, research-gap-call-verifier, scope-signal, kol-ivr-route, VERIFY, dozens of "fail-closed/no-call-default" apps)
- Collections / invoice chasing / payment promises (calle-invoice-recovery, ledger-collections-call, kept, creditcall, GetPaid PR, arc-platform)
- Lead qualification / recruiting / outreach campaigns (hirecall, call-neuron, sundials, vibehub-founder-relay, audition-agent, veyra, callflow-campaign-runner, mobilize, ringedingeding)
- Supplier/procurement quote calls (partline, sparescout, capacityline, supplyline, forgerelay, supplycall-ai, RELAY, QuoteHunter PR)
- Consumer "dreaded call" apps: bill negotiation, cancellations, haggling (ringer, callsweep, hifi-hotel-negotiator, call-on-behalf, casechaser)
- Logistics exceptions & dispatch (logistics-exception, dispatch-pulse, readyline, freshchain-resolver, incidentbridge, blood-bank-dispatch, standby)
- IVR navigation / hold-queue (holdfast, kol-ivr-route)
- Test/monitor/evaluate-the-call tooling (linecanary, voice-preflight, otherend, callsuite, calle-script-advisor, call-summarizer, webhook-result-receiver)
- Recall & safety outreach (recall-outreach, recallready, GridGuard, emergency-dispatch-relay)
- School calls (firstbell attendance app, vaxcheck immunization consent — both open PRs)
- Senior companionship / oral history / family coordination (connected, kincall, metapelet, one-more-story, later-me)

Judging signal: "Real World Impact" explicitly warns against "a generic 'AI that makes phone calls' concept," and "Quality of the Idea" rewards non-obvious, reusable contributions — generic versions of the categories above face both redundancy and the Stage-One/impact bar.

---

## 4. High-cost, high-frequency phone-dependent workflows (with scale evidence)

*Analysis section.* Scale figures cite the highest-trust source available; some are industry/vendor estimates and are labeled as such. "Collision" = overlap with observed submissions in §3.

| # | Workflow (industry) | Why the phone is load-bearing | Scale evidence | Collision |
|---|---|---|---|---|
| 1 | **Insurance eligibility/benefit verification & prior-auth status calls** (healthcare providers → payers) | Portals/EDI don't cover all payers; staff dial payer IVRs and sit on hold | CAQH Index 2024: US healthcare admin spend ~$440B/yr, ~$90B in tracked transactions; automating eligibility + claim-status = **>$15B/yr** opportunity. AMA 2025 survey: **~40 prior auths/physician/week, ~13 hrs/wk of physician+staff time, 40% of practices have dedicated PA staff** | Partial: kol & kol-ivr-route do *claim-status* calls; dedicated prior-auth/eligibility-verification workflow largely open |
| 2 | **Vendor bank-detail / payment-change verification callbacks** (finance/AP anti-fraud) | Out-of-band voice confirmation to a known-good number is the FBI-recommended control | FBI IC3: BEC losses **$2.77B in 2024 alone; ~$55B cumulative 2013–2023**, 186 countries. FBI PSAs explicitly prescribe call-back verification | Partial: verify-contact-claim, fraud-ops-caller, scope-signal adjacent; purpose-built vendor-master change-verification product appears open |
| 3 | **Benefits/safety-net renewal outreach & procedural-disenrollment rescue** (public sector, Medicaid-type) | Enrollees miss mail/portal notices; states run outbound phone outreach; multilingual needed | KFF unwinding tracker: **>25M disenrolled, ~69% for paperwork/procedural reasons**; KFF survey: 36% of enrollees had heard nothing about renewal requirements | **None observed** — no benefits-renewal/government-enrollment entries in the repo |
| 4 | **Freight broker check-calls & track-and-trace** (logistics) | Drivers/dispatchers answer voice, not email; GPS can't capture ETA/appointment/detention context | Vendor estimates (label: secondary): ~5 check-calls per active load/day → ~1,000 calls/day per 200-load brokerage ≈ 1.1–1.4 FTE (~$57K/yr); McKinsey-cited figure: 40% of operator time on repetitive carrier calls; Vooma: up to 25% of rep's day asking "where's the truck" | Partial: logistics-exception, dispatch-pulse, supplyline exist; full always-on track-and-trace product less covered |
| 5 | **Court-date appearance reminders / FTA reduction** (public defenders, courts, bail) | FTA → arrest warrants & jail; texts help, but voice reaches non-texters and can answer questions | Science (Fishbane et al., NYC RCT): text reminders cut FTA up to 26% (~3,700 fewer warrants/yr). Santa Clara County RCT (Science Advances): warrants −20%, incarceration 6.6%→5.2%. J-PAL review: phone-call reminders among proven channels | **None observed** |
| 6 | **Field-service appointment confirmation & access coordination** (utilities, telecom, trades) | Wasted truck rolls when customer/site isn't ready; techs need gate codes/ETA confirmation | Truck roll ~$200–$500/dispatch (Aberdeen $200–300; S&C Electric $250–500 utilities — industry estimates, not peer-reviewed); failed-visit → ~1.6 extra dispatches | Partial-heavy: service-dispatch-call, readyline, revisit-zero, onereach-service-followup, deskhelp |
| 7 | **Medical appointment no-show prevention + waitlist backfill** (healthcare) | Empty slots can't be resold; phone confirmation + same-day refill is the fix | BMC Health Services Research: mean no-show 18.8%, ~$196 per no-show; widely cited industry estimate ~$150B/yr US (secondary) | **Heavy**: appointment-confirm, slotsaver PR, multi-party-scheduler, callback-window-coordinator, lead-follow-up-booking |
| 8 | **B2B collections / AR follow-up calls** (any B2B) | Email reminders plateau; phone follow-up materially raises pay-in-a-week rates | Intrum European Payment Report 2023 (10,000+ firms, 29 countries): **€275B/yr cost, avg firm spends 74 days/yr chasing late payments**; Chaser 2026: 76% of businesses spend ≥3 hrs/wk on AR; follow-up on all overdue invoices → 76% more likely paid within a week | **Heavy**: kept, ledger-collections-call, calle-invoice-recovery, creditcall, GetPaid PR |
| 9 | **School absence/truancy notification + follow-up calls** (K-12) | Legally mandated parental notification; multilingual; huge daily call volume in front offices | CA Ed Code §48260.5 mandates truancy notification (Fresno USD claimed ~$1.65M for the program, CA State Controller audit); IES REL study: phone calls among supports linked to falling absenteeism; ~4M elementary students chronically absent (IES) | **Direct**: firstbell school-attendance app is an open PR; vaxcheck consent app too |
| 10 | **Insurance FNOL intake & claims-status surge** (carriers/TPAs) | Post-catastrophe call spikes exceed staffing; claims-status calls flood in 3–5 days after events | US P&C loss adjustment expense ~$80.1B/yr (NAIC data, secondary synthesis); human FNOL call est. ~$7.50–$25/interaction (McKinsey-cited, secondary). **Caveat: FNOL is mostly inbound — dev API is outbound-only; only "callback"-style flows fit** | Partial: casechaser (claim chasing), kol (claim status) |
| 11 | **Restaurant/hospitality reservation confirmation & waitlist fill** | Same as #7 at smaller scale; calls recover would-be empty tables | OpenTable: **28% of Americans no-showed a reservation in the past year**; a 6-person no-show ≈ 5% of a night's revenue vs 3–5% typical margin; Bloom Intelligence (641K reservations): 3.7% no-show + 15% cancel | Partial: CallForgeAI restaurant booking PR, before-we-go |
| 12 | **Property management maintenance triage & vendor dispatch** (residential/commercial RE) | Tenant calls drive the workload; emergency triage + vendor scheduling is phone-native | Weaker quantified public evidence found; high call volume is well documented qualitatively in property-management operations (label: unverified scale) | Light: centre-remix (leasing board, fake-call demo), VERIFY (rental listing verification) — no real maintenance-dispatch entry seen |

### Whitespace ranking (analysis, not official)

Judged on: size of quantified problem × how directly CALL-E's actual capabilities fit (outbound goal-driven calls, structured results, IVR/hold handling, batch) × collision density × "Real World Impact"/"Technical Implementation" judging alignment.

- **Tier 1 — biggest whitespace:** (a) **#2 vendor/payment-change verification** — the only entry where the recommended real-world control is *literally a verification phone call*, the loss figure is FBI-quantified in the billions, and no direct competitor exists; (b) **#3 benefits/procedural-disenrollment outreach** — tens of millions affected, zero submissions observed, strong multilingual fit; (c) **#1 prior-auth/eligibility verification** — the largest admin-cost pool, healthcare is crowded overall but the payer-side hold-line niche is thin.
- **Tier 2 — strong but caveated:** #4 freight check-calls (huge frequency; partial collisions; evidence is vendor-sourced), #5 court reminders (RCT-proven, zero competition, but public-sector buyer makes "real users" harder to demonstrate), #10 claims surge (constrained by outbound-only API — must be framed as scheduled callbacks).
- **Tier 3 — crowded; needs a sharp differentiating angle to stand out:** #6 field service, #7 medical no-shows, #8 collections, #9 school attendance, #11 restaurants, plus anything in the §3 crowded list.
- **Cross-cutting platform constraint for any pick:** outbound-only dev API; ~45-country reach with "international line = testing-grade" caveat for non-local-line countries; @gmail-only sign-in currently; 20 free calls (+~200 by request form) at $0.05/call after — a demo should conserve calls.

---

## 5. Uncertainties, gaps, and inaccessible pages

- **Devpost project gallery not published** — true submission count/categories on Devpost are unknown; the GitHub PR feed is a proxy (some PRs may be non-submission contributions, and some submissions' PRs may still be unmerged/closed).
- **No stated team-size cap** — the rules are silent; not an official "unlimited" confirmation.
- Extra-calls form says "additional calls"; rules text says "an additional 200 calls" — the 200 figure is from the rules; actual grants are discretionary.
- Pricing page does not exist as a dedicated page; the $0.05/call figure comes from the heycall-e.com FAQ and is labeled early-stage/non-final. CALL-E credit→USD conversion (10,000 credits ≈ $100) is inferred from prize descriptions, not a published rate card.
- MCP endpoint host (`seleven-mcp-sg.airudder.com`) vs. API host (`api.heycall-e.com`) differ — both official.
- Forum-reported sign-in restriction (@gmail.com only) is described by CALL-E staff as **temporary**; may have changed since ~Sep 9, 2026.
- Scale statistics labeled "secondary" (freight check-call FTE math, truck-roll $, FNOL per-call cost, $150B no-show figure) come from vendor/industry sources, not peer-reviewed or government data.
- Not verified: whether Devpost submissions require the PR to be merged (rules say only to provide the PR URL); whether the awesome-repo PR task-list CI gates acceptance.
- Could not access: Devpost participants/projects listing requires login for detail; Discord contents not indexed; ClawHub skill page not fetched.

## Sources (accessed 2026-09-13)

- https://call-e.devpost.com/ — overview, prizes, judges, judging criteria, requirements
- https://call-e.devpost.com/rules — full official rules
- https://call-e.devpost.com/resources — tools, example skills, support
- https://call-e.devpost.com/project-gallery — unpublished notice
- https://call-e.devpost.com/forum_topics/45114-google-sign-in-issue-and-call-e-infrastructure-issues — official sign-in/risk-control notice
- https://github.com/CALLE-AI/call-e-integrations (README, docs/install/install-guide.md) — platform, integrations, regions, telemetry
- https://github.com/CALLE-AI/awesome-phone-call-agents (README + PR list) — submission repo, observed competition
- https://docs.heycall-e.com/ , /quickstart, /authentication, /goal-runs — API/SDK/auth docs
- https://www.heycall-e.com/ — pricing FAQ, security claims, inbound/SIP notes
- https://www.youtube.com/watch?v=qzHIFuZkCik — official build session
- https://www.caqh.org/hubfs/Index/2024%20Index%20Report/CAQH_IndexReport_2024_FINAL.pdf — CAQH Index 2024
- https://fixpriorauth.org/sites/default/files/2026-05/2025-prior-authorization-survey.pdf and https://www.ama-assn.org/practice-management/prior-authorization/fixing-prior-auth-nearly-40-prior-authorizations-week-way — AMA PA survey
- https://www.ic3.gov/PSA/2024/PSA240911 and https://www.fbi.gov/file-repository/2025_ic3report.pdf — FBI IC3 BEC data
- https://www.kff.org/medicaid/medicaid-enrollment-tracker/ and related KFF unwinding briefs — procedural disenrollment
- https://doi.org/10.1126/sciadv.adx7483 , https://www.science.org/doi/10.1126/science.abb6591 , https://www.povertyactionlab.org/evaluation/text-message-reminders-decreased-failure-appear-court-new-york-city — court-reminder RCTs
- https://doi.org/10.1186/s12913-015-1243-z — no-show prevalence/cost study
- https://www.prnewswire.com/news-releases/chasing-late-payments-costs-european-businesses-275bn-a-year-and-takes-the-average-firm-74-days-to-resolve-intrum-301823050.html and https://www.chaserhq.com/the-2026-accounts-receivable-report — AR burden
- https://www.opentable.com/blog/no-show-numbers/ and https://www.opentable.com/restaurant-solutions/resources/no-show-diners-numbers/ — restaurant no-show data
- https://sco.ca.gov/Files-AUD/MandCosts/05_2015_fresno_truancy.pdf and https://ies.ed.gov/ncee/rel/regions/northeast/pdf/REL_2021099.pdf — truancy-notification mandate/absenteeism supports
- https://www.keelway.com/blog/automated-check-calls-roi-math and https://www.vooma.com/resources/from-managing-exceptions-to-never-missing-milestones — freight check-call load (vendor/secondary)
- https://aexinc.com/blog/truck-roll-cost-benchmarks-fiber and https://vsight.io/glossary/what-is-a-truck-roll/ — truck-roll cost (industry estimates)
- https://afrishorebpo.com/fnol-outsourcing-south-africa/ — FNOL cost/LAE synthesis (secondary)
