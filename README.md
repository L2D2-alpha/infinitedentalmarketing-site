# Infinite Dental Marketing — website

Jekyll site for infinitedentalmarketing.com. Marketing pages for Brooke AI
plus the 10DLC compliance pages preserved at their original URLs.

## How this site works (30-second version)

- **GitHub Pages builds Jekyll automatically.** Push to the repo and the site
  rebuilds — no local tooling required.
- **Layouts and includes** live in `_layouts/` and `_includes/`. The header
  and footer exist in exactly one file each.
- **All colors** live in one `:root` block at the top of
  `assets/css/main.css`. Light theme is the default; dark theme applies
  automatically for visitors whose device is set to dark mode
  (`prefers-color-scheme`).
- **Shared values** (phone numbers, price, email) live in `_config.yml`
  under `company:`. Change once, updates site-wide. Note: `_config.yml`
  changes require a rebuild (any push triggers one).
- **Blog posts** are Markdown files in `_posts/` named
  `YYYY-MM-DD-title-slug.md`. Drop a new file in, push, done.

## Deploying over your existing repo

1. Back up your current repo (or just rely on git history).
2. Copy everything in this folder into the repo root, replacing the old files.
3. Copy `opt-in-form-screenshot.png` from your old repo into `sms-consent/`
   (see the note file in that folder).
4. If your repo has a `CNAME` file for the custom domain, KEEP IT. If not,
   ensure the custom domain is still set in repo Settings → Pages.
5. Push. GitHub Pages rebuilds in a minute or two.

## Launch checklist — placeholders to replace

- [ ] **Demo phone number.** Placeholder is `(763) 555-0142` / `+17635550142`.
      After provisioning the demo line in Telnyx, update `demo_number` in
      `_config.yml`, then search the repo for `555-0142` and replace the
      hardcoded `tel:` links: `grep -rn "555-0142" .`
- [ ] **Demo recording.** Record a demo call and save it as
      `assets/demo/demo-call.mp3`. Then edit
      `assets/demo/transcript.json` to match the real recording — each line
      needs a `t` (seconds when the line starts), `speaker`
      (`brooke` or `patient`), and `text`. Until the mp3 exists, the player
      degrades gracefully (transcript shows, audio is silent).
- [ ] **SMS consent screenshot** copied into `sms-consent/` (see above).
- [ ] **Included call volume.** Currently 600/month in `_config.yml` — set
      this once you've reviewed real per-call costs from the shadow-mode logs.
- [ ] **Governing law in Terms of Service** says Texas; IDM is a Minnesota
      business. Confirm with your attorney and update `terms-of-service.md`.

## Compliance URLs — do not break these

Your Telnyx 10DLC campaign registration references these exact paths:

- `/privacy-policy/`
- `/terms-of-service/`
- `/sms-consent/`

They are preserved in this build (`privacy-policy.md`, `terms-of-service.md`,
`sms-consent.md`) with the original content word-for-word. If you edit them,
keep the URLs identical. Note: your old site also displayed the privacy
policy and terms on the homepage itself — the standalone URLs above are what
matter for 10DLC, but double-check which URLs you submitted to Telnyx before
going live.

## Local preview (optional)

Not required, but if you want to preview before pushing:

```
gem install bundler jekyll
jekyll serve
```

Then open http://localhost:4000.
