# Domain & Site Architecture — hirebrooke.com + Infinite Dental Marketing

**Date:** 2026-08-11 · **Status:** Approved by Lam (remote session)

## Purpose

Map the owned domains to a two-site structure: hirebrooke.com as the customer-facing
sales arm for Brooke AI, infinitedentalmarketing.com as the parent brand. Consolidate
the scattered website repos into one `~/websites/` folder.

## Verified current state (2026-08-11)

| Domain | State |
|---|---|
| `hirebrooke.com` (apex) | Owned. **No DNS record — empty slot.** NS at Namecheap (registrar-servers.com) |
| `app.hirebrooke.com` | **Live** — Brooke production dashboard, AWS (18.209.137.160). Untouchable |
| `hirebrook.com` | Owned, defensive only |
| `brookedental.com` | Owned, defensive only |
| `infinitedentalmarketing.com` | **Live** — Jekyll on GitHub Pages from `master` of `infinite-dental-site` (CNAME). Currently a Brooke sales site |
| `infinitedental.com` | **NOT owned** — third-party redirect to infinitesmiles.com (Ohio dentist). Never reference it |

Vercel serves preview only for the IDM repo (`X-Robots-Tag: noindex` on all routes);
config committed but no deployment exists yet (CLI auth never completed).

## Design

### 1. Domains

- `hirebrooke.com` + `www` → **new Jekyll site on GitHub Pages** (CNAME file). Namecheap
  DNS: apex A records → GitHub Pages IPs; `www` CNAME → the Pages hostname.
  `app.hirebrooke.com` record untouched.
- `hirebrook.com`, `brookedental.com` → **registrar-level 301** → hirebrooke.com. No hosting.
- `infinitedentalmarketing.com` → infrastructure unchanged (Pages, master). Content slims
  to parent-brand/about-Lam + link to hirebrooke.com.

### 2. hirebrooke.com — new sales site

- **From scratch** (design + copy). Jekyll + GitHub Pages, chosen for $0 hosting with no
  commercial-use restriction (Vercel Hobby prohibits commercial use; Pro is $20/mo).
  Content in Markdown ports to Astro/Next later in ~a day if features outgrow Jekyll;
  interactive islands (calculators, players) work as plain JS without a framework.
- Copy sourced from the shipped-features list (Appendix A) with its do-not-market
  guardrails. Core narrative: **"a dedicated AI receptionist per practice"** — which is
  the literal architecture.
- Dev on `dev` branch; Vercel noindex preview surface for phone review (same pattern as
  IDM repo). Production = push to `master`.
- Repo private during build; GitHub Pages requires public repo (or Pro) at launch —
  decide at launch time.

### 3. infinitedentalmarketing.com — slim-down (LAST)

- Becomes: who Lam is / parent brand, pointing to hirebrooke.com for Brooke.
- **Frozen, load-bearing (10DLC/Telnyx):** `/privacy-policy/`, `/terms-of-service/`,
  `/sms-consent/` (+ `opt-in-form-screenshot.png`) — exact paths, content preserved.
- Does not shrink until hirebrooke.com is live and indexed — it is currently the only
  sales presence.

### 4. Folder consolidation → `~/websites/`

| Target | Source | Notes |
|---|---|---|
| `websites/hirebrooke/` | new | scaffolded fresh |
| `websites/infinite-dental-marketing/` | `~/infinite-dental-site` | the live-CNAME repo |
| `websites/brooklyn-blvd-dental/` | `mullyai-bot/brooklyn-blvd-dental-v4` | newest BBD line |
| `websites/osseo-family-dental/` | `mullyai-bot/osseo-family-dental` | **git init immediately — currently zero version control** |
| `websites/_archive/…` | old static IDM (`~/infinite-dental-marketing`), Astro attempt (`mullyai-bot/infinite-dental`), BBD v1 + `-backup` duplicate, `dental-remodel`, `dental-remodel-engine` + generated outputs | archive, never delete |

Rules: `mv` only, no deletions; confirm each move (several are repos nested inside the
`mullyai-bot` repo); `BBD-AI-Dental-Receptionist` is the product, not a website — stays put.

### 5. Order of operations

1. Consolidate folders; rescue Osseo into git.
2. Scaffold hirebrooke repo; build first-draft site (design + copy); Vercel preview for review.
3. DNS: point hirebrooke.com at Pages; set defensive redirects.
4. Slim IDM site (only after hirebrooke.com is live and indexed).

## Error handling / risks

- **Compliance URLs breaking** → 10DLC campaign risk. Mitigation: paths frozen; any IDM
  edit verifies all three URLs + screenshot still resolve before push.
- **Moving the live repo** (`infinite-dental-site`): pure filesystem move — Pages builds
  from GitHub, not the local path. Local tooling paths (memory files, session cwd) update after.
- **Nested-repo moves out of mullyai-bot**: each keeps its own `.git`; untracked dirs move freely.
- **DNS mistakes on hirebrooke.com**: only ADD apex/www records; never touch the `app.` record.

## Testing / verification

- After each site deploy: `bundle exec jekyll build` clean; eyeball at 375px; curl the
  live URL + compliance URLs return 200.
- After DNS: `dig` apex/www resolve to Pages; `app.hirebrooke.com` still resolves to 18.209.137.160;
  defensive domains 301 correctly.
- After consolidation: every moved repo `git status` clean; Osseo has an initial commit
  (and a private GitHub remote as backup).

## Appendix A — Copy source: shipped Brooke features (from production codebase review, 2026-08-11)

**Safe to market (shipped, live on production practice):**
1. Instant 24/7 answering — picks up in seconds, every call; after-hours callers get help, not voicemail.
2. Concurrent calls — no busy signal in Monday-morning call storms.
3. Real Open Dental integration — books/reschedules/cancels on the actual schedule while the caller is on the line; writes commlog notes. (Say "Open Dental" by name — never "your PMS".)
4. Caller recognition — greets returning patients by name from caller ID; family accounts.
5. Identity verification — DOB gate before any patient-specific action; HIPAA conversation rules built in.
6. Scheduling intelligence — time-of-day preferences up to a year out, per-provider new-patient capacity, appointment-length rules, blockout awareness, no double-booking.
7. New-patient intake — creates the patient record (spelled-name capture); first visits routed only to providers accepting new patients.
8. Human escalation — SMS + email alerts, per-contact routing, tokenized secure transcript links, dental-emergency protocol; nothing clinical answered by AI.
9. Insurance conversation handling — knows accepted carriers, conversion-focused objection handling. **NOT electronic benefits verification — never imply eligibility checks.**
10. Every call recorded, transcribed, summarized — dashboard playback + summary email minutes after each call.
11. Practice dashboard + analytics — outcomes, booking conversion, KPIs, audit log, role-based logins, self-serve settings.
12. Temporary announcements — auto-expiring notices (construction, closures) woven in naturally.
13. Automated call QC — every call machine-scored; failures become permanent regression tests.
14. One isolated system per practice — own agent instance, database, phone number, credentials; encrypted at rest/in transit; secrets in AWS Secrets Manager.
15. Update discipline — canary deploys, blocked during live calls, 1–3 AM practice-local maintenance window, auto-rollback.
16. Spanish support — per-practice toggle with language detection (market it, don't headline it).

**Mention carefully:** 17. Custom practice greeting — shipped this week, canary only. Safe to mention, don't screenshot.

**DO NOT MARKET:** self-serve onboarding times; outbound calls/texts (recall, confirmations); payments/billing; electronic insurance verification; multi-location/DSO features ("multi-location ready" defensible only as "each location gets its own isolated agent"); any PMS besides Open Dental; uptime percentage claims (no published SLA).
