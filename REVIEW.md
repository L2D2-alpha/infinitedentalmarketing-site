# REVIEW.md — Infinite Dental Marketing Site

Rules the code-review step enforces on any change to this repo. A reviewer (human or agent) should
**reject** a change that violates any of these, name the rule, and say what to fix. Ordered by blast
radius — the top ones can take the live site or a compliance registration down.

## Blockers (reject outright)

1. **Broken build.** `bundle exec jekyll build` must complete with zero errors. `master` deploys to
   production with no CI gate — a broken build is a broken live site. No exceptions.
2. **Compliance-page breakage.** Any change that alters the *path* or *content* of `/privacy-policy/`,
   `/terms-of-service/`, or `/sms-consent/`, or removes/renames
   `sms-consent/opt-in-form-screenshot.png`. These are registered with Telnyx for the 10DLC campaign.
   Breaking them risks SMS deliverability. Reject unless Lam explicitly requested the legal edit.
3. **`CNAME` removed or changed.** The `CNAME` file holds `infinitedentalmarketing.com`. Deleting or
   editing it drops the custom domain. Reject.
4. **Vercel `noindex` leaking to production.** `X-Robots-Tag: noindex` belongs to the Vercel preview
   only. Reject any change that would apply noindex (or the Vercel headers) to the GitHub Pages build.
5. **New JS framework / build tooling.** The site is intentionally static (only JS is the demo player;
   nav is pure CSS). Reject React/Vue/npm-build additions — they break the "push and it builds" model.

## Standards (reject unless justified)

6. **Not mobile-first.** CSS or layout that wasn't designed/verified at 375px. 80%+ traffic is mobile.
7. **Hardcoded colors.** Colors anywhere but the `:root` block in `assets/css/main.css`. All theming
   goes through the CSS variables so light/dark stay consistent.
8. **Duplicated shared values.** Phone/price/email/setup-fee hardcoded in a template instead of pulled
   from `_config.yml` `company:`. One source of truth.
9. **Second pattern introduced.** A new header/footer file, a second color system, a new post-naming
   scheme. Convention beats novelty — match what's there.
10. **Placeholder shipped as real.** Publishing `(763) 555-0142`, an empty `demo-call.mp3` path
    presented as live, or the `600` call figure as confirmed — without Lam supplying the real value.

## Quick verification checklist for the reviewer

- [ ] `bundle exec jekyll build` passes clean.
- [ ] Rendered at 375px — nav toggles, no horizontal scroll, tap targets sane.
- [ ] `/privacy-policy/`, `/terms-of-service/`, `/sms-consent/` still resolve with intact content.
- [ ] `CNAME` unchanged; no `noindex` on the Pages output.
- [ ] New colors (if any) live only in `:root`; shared values only in `_config.yml`.
- [ ] No new JS/build dependencies.
