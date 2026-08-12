# Infinite Dental Marketing Site — Project Guidance

Jekyll marketing site for **infinitedentalmarketing.com** (home of Brooke AI). This is the
CANONICAL, deployable repo. Stable facts live here; see `README.md` for the build model and
`idm-site-handoff.md` for the original build manifest.

## The one rule that matters most

**`master` IS production.** GitHub Pages builds Jekyll natively on every push to `master` — there
is no staging gate, no PR review, no CI. A push to `master` is live on www.infinitedentalmarketing.com
within ~1–2 minutes. Never push a broken build. Verify locally first (`bundle exec jekyll build`
must succeed with zero errors) and eyeball the change at 375px before pushing.

## Deploy model (know both surfaces)

- **Production = GitHub Pages**, served at the custom domain via the `CNAME` file
  (`infinitedentalmarketing.com`). Native Jekyll build, GitHub-Pages-whitelisted plugins only
  (`jekyll-seo-tag`, `jekyll-sitemap`). **Never remove or rename `CNAME`** — it holds the domain.
- **Vercel (`vercel.json`) is a preview/staging surface only.** It sets `X-Robots-Tag: noindex` on
  every route on purpose. That noindex must NEVER reach production — it exists to keep the Vercel
  preview out of Google. Don't copy Vercel headers into the Pages config.

## Compliance pages are load-bearing — do not break them

These three URLs were submitted to Telnyx for the 10DLC SMS campaign registration. **Breaking their
paths or content risks the campaign registration** (which took real effort to get GREEN):
- `/privacy-policy/`
- `/terms-of-service/`
- `/sms-consent/` — references `/sms-consent/opt-in-form-screenshot.png`, the exact image Telnyx
  reviewed. Never remove or rename that image.

Do not edit the content of these pages beyond typo/legal fixes Lam explicitly requests. They are
preserved deliberately.

## How the site is structured (edit in the right place)

- **Layouts/includes:** `_layouts/`, `_includes/`. Header and footer each exist in exactly ONE file.
- **All colors:** one `:root` block at the top of `assets/css/main.css`. Light theme default; dark
  theme auto-applies via `prefers-color-scheme`. **Never hardcode colors elsewhere** — change the
  `:root` variables.
- **Shared values** (phone, price, email, setup fee, included calls): `_config.yml` under `company:`.
  Change once, updates site-wide. `_config.yml` edits require a rebuild (any push triggers one).
- **Blog posts:** Markdown in `_posts/`, named `YYYY-MM-DD-title-slug.md`.
- **JS footprint:** the ONLY JavaScript on the site is the demo audio player. Mobile nav is a
  pure-CSS checkbox toggle. Do not add JS frameworks or build steps — keep it static.

## Standing orders

- **MOBILE-FIRST, 375px before desktop.** 80%+ of dental traffic is mobile. Design and verify at
  375px first.
- **Match existing patterns** (Rule #8 — convention beats novelty). One header file, one color block,
  shared values in `_config.yml`. Don't introduce a second pattern.
- **Surgical changes only.** Touch what the task needs; don't "improve" adjacent markup or CSS.

## Known placeholders (leave unless Lam provides real values)

- **Demo number `(763) 555-0142` / `tel:+17635550142`** — hardcoded in several places plus
  `_config.yml` `demo_number`. Find all: `grep -rn "555-0142" .`. Swap only when the real Telnyx
  demo line exists.
- **`assets/demo/demo-call.mp3`** does not exist yet — player degrades gracefully (transcript shows,
  audio silent). When Lam records the demo, save it there and align the `t` timestamps in
  `assets/demo/transcript.json`.
- **`included_calls: 600`** in `_config.yml` — pending real cost data.
- **`terms-of-service` governing law says Texas** — IDM is a Minnesota business. An HTML comment flags
  it; leave for Lam's attorney, don't silently change legal text.
