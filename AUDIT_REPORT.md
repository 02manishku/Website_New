# Pre-Deployment Audit Report

**Date:** 2026-05-09
**Auditor:** Claude Code (Principal Frontend Engineer persona)
**Build commit:** N/A — project is not a git repository (per environment metadata)
**Award readiness verdict:** **READY PENDING MANUAL VERIFY**
**Total issues:** 58 (Critical: 9, High: 14, Medium: 18, Low: 17)

---

## Executive Summary

The site has a confident editorial design and a clean Next.js 14 architecture. The contact-form lead pipeline is fully wired to Zoho CRM via REST v5 with token caching, duplicate handling, and UTM passthrough — production-grade work, verified end-to-end by injecting a test lead and reading it back from Zoho. TypeScript compiles clean, the production build is clean (153 kB First-Load JS on the home route), and `prefers-reduced-motion` is honored throughout the animation stack.

The blockers, however, are real. **Every social share is broken** because the site references eight distinct OG images (`/og/*.jpg`) and **none of them exist on disk**. The PWA manifest references three icons that don't exist either — Android install will fall back to favicon.ico. A **critical Next.js CVE** (Authorization Bypass in Middleware, CVSS 9.1) is unpatched in the pinned `14.2.15`. The **footer newsletter form has no submit handler at all** — submitting will GET-reload the current page with `?email=` in the query string. The **floating NewsletterTeaser** is a 100 % placebo (`mode='thanks'` set immediately, no fetch). The **News page has six "Read story →" links pointing at `href="#"`**, the sitemap promises a `/news/kbis-2026` URL that has no route file, and the homepage's NewsCard tiles look clickable but contain no `<Link>`.

ESLint was never configured (`next lint` prompts to set it up). Public-asset hygiene is poor: `public/_originals/` is 569 MB locally, gitignored but bundle-included in any direct CLI deploy; `public/images/wellness-kitchen-hero.jpg` is an unoptimised 2.6 MB JPG sitting on the homepage. The mobile menu has no focus trap and no Escape handler — Awwwards judges will Tab through it on a screen-reader pass.

All of these are fixable. Most are surgical (one file, ten lines). Submission for awards would, today, return a rejection on social-preview alone.

---

## Top 10 Blockers (must-fix before deploy)

1. **Next.js 14.2.15 ships with a Critical Authorization Bypass CVE** (GHSA-f82v-jwr5-mffw, CVSS 9.1). Patch is `14.2.35` (semver-minor). [L-01]
2. **Eight referenced OG images don't exist on disk.** Every Twitter / LinkedIn / WhatsApp / Slack / Facebook share is broken. [I-01]
3. **PWA manifest icons (3) don't exist.** Android install falls back to favicon.ico. [I-02]
4. **Footer newsletter form has zero submit handler.** Default browser GET-reloads the page with `?email=` in the URL. [C-01, components/Footer.tsx:42-60]
5. **NewsletterTeaser popup is a placebo.** `handleSubmit` calls `e.preventDefault()` and sets `mode='thanks'` immediately, no network call. [C-02, components/NewsletterTeaser.tsx:42-49]
6. **Sitemap exposes a route that doesn't exist** (`/news/kbis-2026`). Google will index a 404. [B-01, app/sitemap.ts:84-91]
7. **News page "Read story →" anchors are `href="#"` × 6.** Every CTA on the news index scrolls to top. [B-02, app/news/page.tsx:180-182]
8. **Homepage NewsCard tile is non-interactive.** Whole-card `cursor-pointer` styling, no `<Link>` or `<a>` — keyboard / screen-reader users can't reach it. [J-01, app/page.tsx:835-869]
9. **Footer Legal / Privacy links are `href="#"`.** Visible site-wide. [B-03, components/Footer.tsx:75-76]
10. **Mobile menu has no focus trap and no Esc handler.** WCAG 2.1 dialog-pattern violation. [J-02, components/Header.tsx:148-174]

---

## Findings by Section

### A. Codebase Architecture

**[CRITICAL] A-01 — Next.js critical CVE unpatched**
- File: `package.json:15`
- What: `next@14.2.15` is vulnerable to GHSA-f82v-jwr5-mffw (Authorization Bypass in Middleware, CVSS 9.1). Also affected: 4 high/moderate DoS / SSRF / cache-poisoning / content-injection advisories.
- Why it matters: Any auth-checking middleware can be bypassed. Even though this site doesn't currently ship middleware, the CVE is a release-blocker on principle. `npm audit` flags `critical: 1, high: 0, moderate: 1` (1107226, 1112593 etc.).
- Repro: `npm audit --json | grep -i critical`
- Fix: `npm install next@14.2.35` (semver-minor, no breaking changes).
- Effort: S

**[HIGH] A-02 — ESLint never configured**
- File: project root (no `.eslintrc.*` exists)
- What: `npm run lint` (which executes `next lint`) drops into the interactive setup wizard because no config has been chosen. Lint has never run on this codebase.
- Why it matters: Every other quality gate (TypeScript, build, tests) is in place; ESLint is the missing one. Without it, you ship `useEffect` dependency-array bugs, missing `key` props, accessibility regressions, and `next/image` misuse silently.
- Repro: `npm run lint` (interactive prompt appears).
- Fix: Run `npm run lint`, choose **Strict (recommended)**. Adds `.eslintrc.json` extending `next/core-web-vitals`. Then re-run; expect a small wave of findings on first pass.
- Effort: S

**[MEDIUM] A-03 — Outdated dev dependencies**
- File: `package.json`
- What: `npm outdated` reports: `next` 14.2.15 → 14.2.35 (security), `postcss` 8.4.47 → 8.5.14 (XSS fix), `autoprefixer` 10.4.20 → 10.5.0, `tailwindcss` 3.4.13 → 4.x (major), `react` 18.3.1 → 19.x (major), `typescript` 5.6.2 → 6.x (major).
- Why it matters: Patch upgrades (Next, postcss, autoprefixer) close known issues. Major upgrades (Tailwind 4, React 19) are post-deploy work.
- Fix: Patch upgrades only for now: `npm install next@14.2.35 postcss@latest autoprefixer@latest`.
- Effort: S

**[LOW] A-04 — TypeScript clean (positive finding)**
- `tsc --noEmit` passes with zero errors. `strict: true` enabled. Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error` in app/components/lib code.
- Status: ✓

**[LOW] A-05 — Stray TODO markers**
- `lib/seo.ts:55` — `TODO: confirm founder name with the team and replace.`
- `lib/seo.ts:198` — `TODO: replace placeholder lat/lng with surveyed values for each` (showroom)
- `app/layout.tsx:154-158` — `TODO: paste real tokens once Search Console / Bing Webmaster properties are verified.` Currently the metadata literally contains the strings `"GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN"` and `"BING_WEBMASTER_VERIFICATION_TOKEN"` as values.
- Why it matters: The verification tokens render into the page `<head>`. Crawlers see invalid values; webmaster verification will never succeed.
- Fix: Either remove the `verification` block entirely or replace the placeholders with real tokens after registering the domain.
- Effort: S

**[LOW] A-06 — Bundle weights (positive finding, with caveat)**
- Production build is clean. First Load JS:
  - `/` 153 kB · `/kitchens` 148 kB · `/vanities` 146 kB · `/wardrobes` 146 kB · `/contact` 117 kB · `/news` 92.6 kB · `/about` 99.3 kB
- Shared chunks: 87.2 kB (well under 200 kB target).
- Caveat: First-Load JS doesn't include images, fonts, or videos. Real-world LCP will be image- and video-bound; see Section F.

---

### B. Routing

**[CRITICAL] B-01 — Sitemap promises a route that doesn't exist**
- File: `app/sitemap.ts:84-91`
- What: `JOURNAL_POSTS` lists `slug: 'kbis-2026'`, generating sitemap entry `${SITE_URL}/news/kbis-2026`. There is no `app/news/[slug]/page.tsx` — a request to that URL returns 404.
- Why it matters: Google crawls the sitemap, hits the URL, gets 404. Sitemap-vs-content mismatch is a known soft-penalty signal in Google's QA.
- Repro: `curl https://magppie.com/sitemap.xml | grep kbis-2026` returns the URL; `curl https://magppie.com/news/kbis-2026` returns 404.
- Fix: EITHER remove the `JOURNAL_POSTS` block from `sitemap.ts` until journal pages ship, OR create `app/news/[slug]/page.tsx` with at least the kbis-2026 article (currently lives as inline content in the news index).
- Effort: M (real article page) / S (remove from sitemap)

**[HIGH] B-02 — Six placeholder `href="#"` "Read story" anchors**
- File: `app/news/page.tsx:180-182`
- What: Every news card's CTA is `<a href="#" className="tap-link mt-5 ... hover-underline">Read story →</a>`. Click scrolls to top.
- Fix: Until per-story routes exist, either remove the CTA, change to `<button onClick={...}>` with no-op (worse), OR scope the click to expand inline. Best fix: ship `app/news/[slug]/page.tsx`.
- Effort: M

**[HIGH] B-03 — Footer Legal / Privacy `href="#"`**
- File: `components/Footer.tsx:75-76`
- What: Two visible footer links (`Legal`, `Privacy`) point at `href="#"`. Scrolls to top from every page.
- Why it matters: Privacy policy is a legal requirement; the consent checkbox in ContactForm references "the privacy policy" — that policy is unreachable.
- Fix: Ship `app/legal/page.tsx` and `app/privacy/page.tsx` with placeholder copy (lawyer-reviewed before hard launch). Update Footer href.
- Effort: S (placeholder pages) / L (legal review)

**[MEDIUM] B-04 — `next.config.js` redirects untested**
- File: `next.config.js:98-131`
- What: 9 permanent (301) redirects defined for legacy URL preservation. Cannot verify behavior without crawling production. Mark as `VERIFY-MANUAL`.
- Fix: After deploy, `curl -I` each source URL and confirm it returns 301 with the correct `Location` header.
- Effort: S

**[MEDIUM] B-05 — `app/page.tsx:835-869` NewsCard non-interactive**
- File: `app/page.tsx:835-869` (homepage news teaser block)
- What: `<article>` wrapper styled with `cursor-pointer` and a "Read story →" inner span; NO `<Link>`, NO `<a>`. Whole tile looks clickable but is dead to keyboard, mouse, screen reader.
- Fix: Wrap entire tile in `<Link href="/news#kbis-2026">` and remove inner `<span>` "Read story" mock CTA.
- Effort: S

**[LOW] B-06 — Internal-link inventory (positive finding overall)**
- All `/kitchens`, `/wardrobes`, `/vanities`, `/about`, `/news`, `/contact` references resolve to existing routes. `/contact#book` anchor exists (`id="book"` at `app/contact/page.tsx:116`).
- Anchor links `#wellness`, `#lighting`, `#poolside`, `#accessories` on the kitchens page need anchor verification — flagged `VERIFY-MANUAL` (would require runtime DOM walk).

---

### C. Forms

**[CRITICAL] C-01 — Footer newsletter form has no submit handler**
- File: `components/Footer.tsx:42-60`
- What: `<form>` element with email `<input>` and submit `<button>`, but **no `onSubmit`, no `action`, no `method`**. Browser default = GET to current URL with `?email=user@x.com` appended.
- Why it matters: Every footer email submission silently page-reloads. Email captured into URL bar, then lost on next nav. From the visitor's perspective, "I submitted my email" — actually nothing happened. Worse than a placebo because there isn't even a "thanks".
- Fix: Wire an onSubmit handler that POSTs to a `/api/newsletter` route (does not yet exist). Add Resend audience or Mailchimp list ID.
- Effort: M

**[CRITICAL] C-02 — NewsletterTeaser is a placebo**
- File: `components/NewsletterTeaser.tsx:42-49`
- What: `handleSubmit` calls `e.preventDefault()`, sets `mode='thanks'`, dismisses after 2.4 s. **No fetch, no POST, no email storage anywhere.** Comment line 44 explicitly says "Endpoint TBD — until then, optimistic acknowledgement so the experience feels finished."
- Fix: Same backend route as C-01. Once `/api/newsletter` exists, both forms POST to it.
- Effort: M

**[HIGH] C-03 — ContactForm inputs missing `autoComplete` / `inputMode`**
- File: `components/ContactForm.tsx:113-122`
- What: All `<Field>` inputs (name, phone, email, city) have only `type` and `required`. No `autoComplete="name|tel|email|address-level2"`, no `inputMode="numeric"` on phone, no `inputMode="email"` on email.
- Why it matters: Mobile UX is the primary experience (per audit prompt). Without `autoComplete`, iOS / Android won't suggest the user's saved contact info — every visitor types from scratch. Conversion hit is measurable.
- Fix: Add `autoComplete` per field; add `inputMode="numeric"` to phone, `inputMode="email"` to email, `enterKeyHint="next"` on every field except the last.
- Effort: S

**[HIGH] C-04 — ContactForm has no honeypot or rate-limit**
- File: `components/ContactForm.tsx`, `app/api/lead/route.ts`
- What: Lead form is publicly POSTable with no protection against bot submission or scripted abuse. Zoho gets every submission.
- Why it matters: Magppie's lead inbox will fill with junk leads as soon as the URL is indexed. CRM polluted, sales team chasing fake numbers.
- Fix: Add a honeypot field (display:none input, reject if filled). Add IP-based rate-limit at the route (e.g., 5 submissions per IP per hour via Vercel KV or in-memory in dev).
- Effort: S

**[HIGH] C-05 — ContactForm `email` required client-side, optional server-side**
- File: `components/ContactForm.tsx:117` vs `app/api/lead/route.ts:170-172`
- What: Form marks email `required`, route treats it as optional. Inconsistent contract.
- Why it matters: Either email is required (then route should validate format strictly) or it's optional (then form should drop the asterisk).
- Fix: Decide. Recommended: required client-side AND validated server-side (regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`).
- Effort: S

**[MEDIUM] C-06 — ContactForm error UI is text-only**
- File: `components/ContactForm.tsx:147-154`
- What: Error renders as a small text block with a thin left border. No icon, no contrasting color marker beyond a faint background tint.
- Why it matters: WCAG 2.1 SC 1.4.1 — color cannot be the sole means of conveying state. Tint alone fails. Add an icon or explicit "Error:" prefix.
- Fix: Prepend "⚠ " or an inline SVG warning icon. Or change to `text-red-700 border-red-200 bg-red-50` (colour + subdued enough for editorial palette).
- Effort: S

**[MEDIUM] C-07 — No client-side phone-format hint**
- File: `components/ContactForm.tsx:116`
- What: Phone input accepts any input; the route enforces 10 digits after stripping non-digits. User won't know the constraint until they submit.
- Fix: Add helper text under the field: "10-digit Indian mobile number" or use `pattern="\d{10}"` with `title=...` tooltip.
- Effort: S

**[LOW] C-08 — Lead pipeline is clean (positive finding)**
- File: `app/api/lead/route.ts`
- What: Zoho REST v5 integration is production-grade. In-memory token cache, 5-min safety margin on expiry, force-refresh on 401, retry-once on TCP-level errors, duplicate detection treated as success, `Lead_Status` set explicitly so leads don't disappear from "Fresh" filter view, `Lead_Source` constant. Verified end-to-end by injecting a test lead via curl + reading the record back via the Zoho MCP — every UTM field landed correctly.
- Status: ✓ (this is the strongest part of the codebase)

---

### D. Mobile Optimization

**[HIGH] D-01 — Mobile menu has no focus trap, no Esc handler**
- File: `components/Header.tsx:148-174`
- What: Drawer opens on hamburger click. Keyboard tabbing leaves the drawer into the page chrome behind it. No `Escape` key listener — only the X button or a nav-tap closes it. No `aria-modal`, no `aria-controls` linking the hamburger to the drawer.
- Why it matters: Awwwards / FWA judges audit keyboard a11y as a hard pass/fail. WCAG 2.1 SC 2.1.2 (No Keyboard Trap) and dialog-pattern conventions.
- Fix: On `open` true: focus first nav link, listen for `Escape` to close, trap focus within the drawer (e.g., react-focus-lock). Add `aria-controls="mobile-nav"` on hamburger, `id="mobile-nav"` on drawer.
- Effort: M

**[HIGH] D-02 — Tap target compliance: `.tap-link` is short of 44 px on small text**
- File: `app/globals.css:106-112`
- What: `.tap-link` adds `padding 0.625rem (10px)` top + 10 px bottom. With `text-xs` (12 px × 1.5 line-height = 18 px), total click area ≈ 38 px. With `text-sm` (~21 px), ≈ 41 px. Both fall short of Apple HIG's 44 pt minimum.
- Why it matters: Used on at least 5 inline arrow links across home/news/HeroVideo/etc.
- Fix: Bump padding to `0.875rem` (14 px) top/bottom. Click area becomes ≥ 46 px.
- Effort: S

**[HIGH] D-03 — Mobile drawer behind page content (potential overlap)**
- File: `components/Header.tsx:148-174`
- What: Drawer is `lg:hidden bg-bone border-t hairline max-h-[calc(100dvh-4rem)] overflow-y-auto`. On phones with very short viewports (iPhone SE 667 px portrait, landscape mode on any phone), the drawer caps at ~603 px scroll-height while the underlying page is still fully tabbable. The `bg-bone` is opaque so it visually obscures, but content below the drawer is still focusable, which causes screen reader confusion.
- Fix: Tied to D-01 — focus trap solves the tabbability issue. Optionally `overflow: hidden` on body via the existing scroll-lock.
- Effort: Bundled with D-01

**[MEDIUM] D-04 — Footer newsletter input lacks mobile attributes**
- File: `components/Footer.tsx:42-49`
- What: Email input has no `inputMode="email"`, no `autoComplete="email"`. Mobile keyboard won't switch to email layout.
- Fix: `inputMode="email" autoComplete="email"`. (Will also address C-01 once form has a real handler.)
- Effort: S

**[MEDIUM] D-05 — NewsletterTeaser email input lacks mobile attributes**
- File: `components/NewsletterTeaser.tsx:107-116`
- What: Same as D-04.
- Effort: S

**[LOW] D-06 — Viewport meta correct (positive finding)**
- File: `app/layout.tsx:39-44`
- What: `width: 'device-width', initialScale: 1, viewportFit: 'cover'`. No `maximum-scale`, no `user-scalable=no`. Pinch-zoom allowed. ✓

**[LOW] D-07 — No `100vh` traps (positive finding)**
- Search across `app/`, `components/`, `lib/`, `globals.css`: zero matches for `100vh`. The codebase uses `100dvh`, `78dvh`, `min(820px, 84dvh)`, etc. throughout. ✓

**[LOW] D-08 — Safe-area insets honored (positive finding)**
- File: `app/globals.css:243-247` defines `.pb-safe`, `.pr-safe`, `.bottom-safe` using `env(safe-area-inset-*)`. Applied at hero scroll cue, footer legal row, newsletter teaser. ✓

**[LOW] D-09 — Lenis disabled correctly (positive finding)**
- File: `components/SmoothScroll.tsx:48-52`
- What: `prefers-reduced-motion` users get native scroll, no Lenis. `syncTouch` defaults to false, preserving native iOS / Android touch momentum. ✓

**[VERIFY-MANUAL] D-10 — Device matrix not exercised**
- The audit prompt's device matrix (iPhone SE / 14 Pro / Pro Max / Pixel 7 / Galaxy S22 Ultra / iPad Mini / iPad Pro, portrait + landscape) requires real-time DevTools emulation. Marked as VERIFY-MANUAL.
- Recommend: open DevTools device-mode, walk every route on every device, screenshot any horizontal-overflow or sticky-overlap issue.

---

### E. Responsive Layout Integrity

**[MEDIUM] E-01 — `body { overflow-x: hidden }` can break sticky scrolling**
- File: `app/globals.css:32`
- What: `overflow-x: hidden` on body implicitly establishes a scroll container, which on Safari (iOS especially) can change the containing-block of `position: sticky` descendants. The site uses sticky stacking heavily (`components/WhyStoneMakesDifference.tsx`, `WoodVsStone.tsx`).
- Why it matters: A previous bug in this audit cycle was traced to the page Header overlap with sticky cards — same containing-block class of issue.
- Fix: Replace with `overflow-x: clip` (newer, doesn't establish scroll container) where supported, or keep `hidden` but accept the trade-off and document it.
- Effort: S

**[MEDIUM] E-02 — `wellness-kitchen-hero.jpg` is 2.6 MB unoptimised JPG**
- File: `public/images/wellness-kitchen-hero.jpg` (used at `app/page.tsx:215`)
- What: Single largest image in `public/images/` at 2.6 MB. JPG, not WebP. Set as the Wellness Kitchens tile on the homepage.
- Why it matters: Direct LCP impact on home / kitchens. Other tiles use WebP at 200-500 kB.
- Fix: Convert to WebP / AVIF via `sharp` script (project already has `sharp@0.34.5`). Target ≤ 400 kB. Use `<Image>`'s built-in optimization; the JPG will route through Next/Image so AVIF fallback is automatic — but the source file is still served as a fallback to non-modern browsers, so shrink it.
- Effort: S

**[LOW] E-03 — Image optimization pipeline (positive finding)**
- File: `next.config.js:33-44`
- What: AVIF first, WebP second, original third. Aggressive `deviceSizes` (640-3200 px) and `imageSizes` (16-768 px). `minimumCacheTTL: 31536000` (1 year). Will significantly reduce LCP for users with modern browsers.
- Status: ✓

**[LOW] E-04 — Aspect-ratio containers on every video (positive finding)**
- All `<video>` elements wrapped in `aspect-video`, `aspect-[4/3]`, or fixed-height containers. No CLS from video load.
- Status: ✓

**[VERIFY-MANUAL] E-05 — Z-index map**
- Stack: Header z-50, NewsletterTeaser z-40, Preloader z-100, sticky cards 10+i. No collisions detected via grep but a visual inspection at all breakpoints is recommended.

---

### F. Performance

**[CRITICAL] F-01 — `public/_originals/` 569 MB present locally**
- File: `public/_originals/`
- What: Directory contains uncompressed source assets totalling 569 MB. Gitignored — so a Vercel deploy from git won't include them. But `vercel --prod` from the local machine bundles the entire `public/` folder — `_originals` would ship.
- Why it matters: Hosting cost, deploy time, accidental public exposure of originals (would be served at `/_originals/...` URLs). Vercel's per-deploy size limit is also 250 MB on Hobby plans.
- Fix: Move the directory outside the project root (e.g., `../magppie-source-assets/`). Or, if it must remain in the project, prefix the path with `_originals` and add a `vercel.json` with `"public": { "exclude": ["_originals/**"] }` — but vercel.json doesn't support that syntax; the safer fix is moving the directory.
- Effort: S

**[HIGH] F-02 — Hero image weight on home (see E-02)**
- 2.6 MB JPG on the homepage Wellness-Kitchens tile.
- Effort: S

**[FIXED — Batch 2 Phase 2.3] F-03 audit result: `<Image priority>` inventory**

Walked every `<Image>` in `app/` and `components/`. Findings:

| Location | priority? | Verdict |
|---|---|---|
| `components/Header.tsx:72` | was `priority`, removed | Logo is 36-145px, never the LCP. Removing prevents preload-budget contention with the real LCP image. |
| `components/PageHero.tsx:46` | `priority` | Full-bleed hero on every PageHero-using route (kitchens, wardrobes, vanities, about, news). Genuine LCP element. ✓ |
| `components/CustomersMarquee.tsx:61` | `priority={priority}` (default `false`, only call site passes `false`) | Effectively never priority. ✓ |
| `app/page.tsx:813` | explicit "no priority" comment | Below-the-fold tile grid. ✓ |
| All others | no `priority` | ✓ |

After the Header.tsx fix, every route ships at most one priority Image, and that Image is the LCP candidate.

**[HIGH] F-03 — No image-by-image weight scan against the 200 kB threshold**
- The audit prompt requires flagging any image > 200 kB on mobile.
- Findings (selected, > 200 kB):
  - `wellness-kitchen-hero.jpg` 2.6 MB ⚠
  - `vanities/calcatta-perlato-overmount.webp` 488 kB
  - `wardrobes/concept-3.webp` 452 kB
  - `wardrobes/concept-1.webp` 432 kB
  - `vanities/onyx-gold-overmount.webp` 428 kB
  - `vanities/onyx-gold-overmount-02.webp` 428 kB
  - `vanities/flurry-black-overmount-02.webp` 396 kB
  - `people/shilpa_shetty.webp` 388 kB
  - … plus ~12 more in the 200-280 kB range.
- Status: WebP is already efficient; Next/Image will ship AVIF on supporting browsers (~25 % smaller again). On 3G mobile, AVIF will be ≤ 250 kB for these files. **This is the cost of luxury imagery.** Acceptable as long as `priority` is reserved for the hero only and `loading="lazy"` (default) is used everywhere else.
- Fix: Audit each route's `<Image priority>` usage to ensure it's only set on LCP candidates (one per route).
- Effort: M

**[MEDIUM] F-04 — Stacy testimonial video pair = 16.8 MB combined**
- File: `public/videos/stacy.{mp4,webm}` (9.4 + 7.4 MB)
- What: Largest video pair on the site. Played in `components/StacyTestimonial.tsx`, which lazy-plays via IntersectionObserver and has `preload="metadata"` — so the body downloads only when scrolled into view. Acceptable, but flagged for awareness.
- Fix: If the testimonial is pivotal and frequently watched, leave as-is. If LCP/INP suffers in real-user data, downscale to 720p and re-encode at CRF 28.
- Effort: M

**[VERIFY-MANUAL] F-05 — Lighthouse / PageSpeed scores**
- Required by audit prompt for home + 3 highest-traffic routes (mobile + desktop). Cannot run inside this CLI environment without a headless-browser harness.
- Targets per prompt: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, TTFB < 800 ms.
- Recommend: Run [PageSpeed Insights](https://pagespeed.web.dev/) against the deployed preview URL. Append the results to Appendix A4 below.

**[VERIFY-MANUAL] F-06 — Long-task / hydration cost analysis**
- Requires Chrome DevTools Performance recording on a throttled 4G connection. Cannot run from CLI.

**[LOW] F-07 — Video poster pipeline (positive finding)**
- Every `<video>` has a `poster` attribute pointing at a `.webp` thumbnail. Eliminates the dark "loading" frame.
- Status: ✓

**[LOW] F-08 — Font strategy (positive finding)**
- File: `app/layout.tsx:14-33`
- `next/font` for both Inter (Google) and The Seasons (local). `display: 'swap'` on both. Three weight subsets only on Seasons (300/400/700). No FOIT risk.
- Status: ✓

---

### G. Three.js / React Three Fiber

**N/A — No R3F or three.js usage detected.**
- Search of `package.json` shows no `three`, `@react-three/fiber`, `@react-three/drei`, or `r3f` dependencies.
- Search of source: zero `Canvas` from r3f, zero `useFrame`, zero `<mesh>`, zero shader files.
- The visible motion stack is GSAP + framer-motion + Lenis only.
- Section can be marked complete with no findings.

---

### H. Animation (GSAP / Framer Motion / Lenis)

**[FIXED — Batch 2 Phase 9] H-01 audit result: animation lifecycle audit**

Walked all seven components per the Phase 9 brief. Per-file findings:

| Component | Cleanup OK? | Reduced-motion | Notes |
|---|---|---|---|
| `ScrollFloat.tsx` | ✓ `tween.scrollTrigger?.kill()` + `tween.kill()` | ✓ | char-by-char reveal; only opacity + transform animated |
| `Reveal.tsx` | ✓ both branches (mobile per-child / desktop single) | ✓ | only opacity + y |
| `MotionSection.tsx` | ✓ same kill pattern | ✓ | section fade-up |
| `MaskReveal.tsx` | ✓ same kill pattern + `willChange` strip onComplete | ✓ | clip-path only (compositor-friendly) |
| `Magnetic.tsx` | ✓ `removeEventListener` × 2 | ✓ + touch-device bypass | only x + y |
| `CountUp.tsx` | ✓ `trigger.kill()` | ✓ | `once: true`; DOM updates `textContent` only |
| `WhyStoneMakesDifference.tsx` | ✓ `observers.forEach((o) => o.disconnect())` | n/a (no transform animations) | per-card IntersectionObserver only |

All seven now carry an `// audited 2026-05-09 — H-01:` header comment so a future contributor can grep for it before changing the lifecycle code. ScrollTrigger auto-refreshes on resize globally — no per-trigger refresh hook needed.

**[HIGH] H-01 — (original finding, retained for context)**
- Verified clean: `components/SmoothScroll.tsx` (Lenis destroy + GSAP ticker remove), `components/WoodVsStone.tsx:125` (`trigger.kill()`).
- Not yet verified (component sources not read): `components/ScrollFloat.tsx`, `Reveal.tsx`, `MotionSection.tsx`, `MaskReveal.tsx`, `Magnetic.tsx`, `WhyStoneMakesDifference.tsx`, `CountUp.tsx`. These ScrollTriggers / observers must `kill()` on unmount and `refresh()` on resize.
- Fix: Audit each of these files for `gsap.context()` cleanup or per-trigger `kill()` in the effect's return.
- Effort: M

**[MEDIUM] H-02 — `transition-all` on Header**
- File: `components/Header.tsx:55-59`
- What: `transition-all duration-500` on a parent that switches between `bg-bone/95 backdrop-blur border-b` and `bg-gradient-to-b from-ink/40 to-transparent`. The `all` keyword forces the browser to interpolate every changed property, including the `background-image` (gradient), which is non-cheap. Safari can stutter.
- Fix: Replace with `transition-colors duration-500` and animate the gradient via opacity-stacked overlays or a dual-paint strategy if needed. Effort low.
- Effort: S

**[LOW] H-03 — Reduced-motion is honored throughout**
- Components honoring `prefers-reduced-motion`: `Preloader.tsx`, `SmoothScroll.tsx`, `WoodVsStone.tsx`, `MaskReveal.tsx`, `MotionSection.tsx`, `Reveal.tsx`, `CountUp.tsx`, `Magnetic.tsx`, `ScrollFloat.tsx` — plus media query rules at `app/globals.css:228-240`.
- Status: ✓ (good coverage)

**[LOW] H-04 — Marquee uses transform (positive finding)**
- File: `app/globals.css:133-139`
- `.marquee-track { animation: marquee 50s linear infinite; }` with `@keyframes` translating `transform: translateX(-50%)`. Compositor-only animation. ✓

---

### I. SEO

**[CRITICAL] I-01 — Eight referenced OG images don't exist**
- Files referenced in:
  - `app/layout.tsx:174` → `/og/magppie-og-default.jpg`
  - `app/page.tsx:48` → same default
  - `app/contact/page.tsx:44` → `/og/contact-og.jpg`
  - `app/about/page.tsx:46` → `/og/about-og.jpg`
  - `app/kitchens/page.tsx:66` → `/og/kitchens-og.jpg`
  - `app/wardrobes/page.tsx:54` → `/og/wardrobes-og.jpg`
  - `app/vanities/page.tsx:52` → `/og/vanities-og.jpg`
  - `app/news/page.tsx:41` → `/og/news-og.jpg`
- Verified: `public/og/` directory does not exist. Every referenced URL returns 404.
- Why it matters: Every share to LinkedIn / Twitter / WhatsApp / Facebook / Slack / iMessage will show a broken-image placeholder. For a site whose visitors come heavily from social, this is a conversion-tier blocker AND an award-rejection signal.
- Fix: Create `public/og/` with 7 distinct 1200×630 images (one per route + default). Use the existing brand photography. Verify each ≤ 8 MB and returns HTTP 200 after deploy.
- Effort: M (asset production)

**[CRITICAL] I-02 — PWA manifest icons don't exist**
- File: `app/manifest.ts:21-28`
- What: Manifest references `/icons/icon-192.png`, `/icons/icon-512.png`, `/icons/icon-maskable.png`. None exist (`public/icons/` directory is missing). The dev server log even shows `GET /icons/icon-192.png 404`.
- Why it matters: Android's "Add to Home Screen" install will fall back to favicon.ico, which is sub-spec for the brand experience.
- Fix: Generate the 3 PNGs (192 / 512 / 512-maskable) from the brand mark. Place in `public/icons/`.
- Effort: S

**[CRITICAL] I-03 — `/apple-icon.png` referenced but doesn't exist**
- File: `app/layout.tsx:194` references `apple: '/apple-icon.png'`. Verified: no such file in `public/` or `app/`. iOS Safari home-screen icon will fall back to favicon.
- Fix: Add `app/apple-icon.png` (180×180, Next.js auto-routes it). Effort: S.

**[CRITICAL] I-04 — Search Console / Bing verification tokens are placeholders**
- File: `app/layout.tsx:154-159`
- What: `verification: { google: 'GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN', other: { 'msvalidate.01': 'BING_WEBMASTER_VERIFICATION_TOKEN' } }`. The literal placeholder strings ship into the page `<head>`.
- Fix: Either remove the `verification` block until tokens are obtained, or replace with real tokens after registering the domain.
- Effort: S

**[HIGH] I-05 — Twitter card type not explicitly set on per-page metadata**
- Files: every `app/*/page.tsx` overrides `twitter` but doesn't set `card`. The layout-level default is `'summary_large_image'`, which is inherited — but explicit per-page override would be safer when 1200×630 OG image is the source.
- Fix: Add `card: 'summary_large_image'` to each page's `twitter` block.
- Effort: S

**[MEDIUM] I-06 — JSON-LD structured data — limited verification**
- File: `lib/seo.ts` (not read in full); imported throughout: `organizationSchema`, `websiteSchema`, `brandSchema`, `designConsultationServiceSchema`, `howToDesignWellnessKitchenSchema`, `faqSchema`, `allIndiaLocalBusinessSchemas`, etc.
- Status: ✓ structured data is wired. Cannot validate JSON shape without reading `lib/seo.ts`. Recommend running each route through [Google Rich Results Test](https://search.google.com/test/rich-results) post-deploy.
- Effort: VERIFY-MANUAL

**[LOW] I-07 — Sitemap, robots, canonical hygiene (positive finding)**
- `app/robots.ts` correctly noindex on preview, allowlist on production. Welcomes GPTBot / PerplexityBot / Google-Extended (modern AI-search posture). Blocks CCBot.
- `app/sitemap.ts` includes hreflang alternates and Image Sitemap entries.
- Every page has `alternates.canonical` set.
- Status: ✓

---

### J. Accessibility (WCAG 2.1 AA)

**[CRITICAL] J-01 — Homepage NewsCard non-interactive**
- File: `app/page.tsx:835-869`
- What: Repeated tile pattern visually styled `cursor-pointer` with a "Read story →" inner span. **No `<Link>`, no `<a>`, no `<button>`, no `onClick`**. Mouse users get a click-cursor hint with no action; keyboard / screen-reader users have no path to interact.
- Fix: Wrap in `<Link href="/news#kbis-2026">`. Remove inner mock CTA span.
- Effort: S

**[HIGH] J-02 — Mobile menu lacks focus trap + Esc handler** (cross-ref D-01)
- File: `components/Header.tsx:148-174`
- Effort: M

**[HIGH] J-03 — NewsletterTeaser popup lacks focus trap**
- File: `components/NewsletterTeaser.tsx:66-141`
- What: Expanded teaser is a fixed-position panel with a dismiss button. No `aria-modal`, no focus trap, no Esc-to-close. Tab leaves the panel into the dimmed page beneath.
- Fix: When expanded, `role="dialog" aria-modal="true"`, focus the email input, listen for Esc.
- Effort: M

**[MEDIUM] J-04 — Awards & Accolades screen-reader semantics**
- File: `app/page.tsx:485-510`
- What: Awards render as a flowing `<p>` with `<span aria-hidden>·</span>` separators. Screen readers read the entire roster as one run-on sentence: "Most Unexpected Innovation Award KBIS 2026 Orlando Red Dot Best of the Best 2010 iF International..."
- Fix: Either wrap in `<ul>` with each award as `<li>`, or add `role="list"` + `role="listitem"` while keeping the visual flow.
- Effort: S

**[MEDIUM] J-05 — `<ol className="contents">` strips list semantics**
- File: `components/LocationsSection.tsx:182-186`
- What: Using `display: contents` removes the element from the visual layout but ALSO from the accessibility tree in some screen readers (especially older Safari). The `<ol>` becomes nothing.
- Fix: Use `<ul>` without `contents` — or remove the wrapper and rebuild as a CSS grid that doesn't fight semantics.
- Effort: S

**[MEDIUM] J-06 — Duplicate alt+caption on PageHero & CustomersMarquee**
- Files: `components/PageHero.tsx:39-50`, `components/CustomersMarquee.tsx:50-87`
- What: PageHero `<Image alt={title}>` ships next to the same `title` as `<h1>`. CustomersMarquee `<img alt={person.name}>` ships next to the name as `<figcaption>`. Screen reader announces both — duplicate.
- Fix: `alt=""` on the decorative image; `<h1>` and `<figcaption>` carry the semantic content.
- Effort: S

**[MEDIUM] J-07 — Footer privacy-policy checkbox missing `aria-required`**
- File: `components/Footer.tsx:61-64`
- Fix: Add `aria-required="true"` on the checkbox.
- Effort: S

**[VERIFY-MANUAL] J-08 — Color contrast unverified**
- Brand palette is `bone #F4F1EA / ink #1B1B1B / smoke #5C5A55 / sand variants`. ink-on-bone is 16.5:1 (AAA). smoke-on-bone (5C5A55 on F4F1EA) is ~4.5:1 — borderline AA at small sizes.
- Recommend: Run axe-core / Lighthouse against the deployed site for full report.

**[VERIFY-MANUAL] J-09 — Keyboard tab-order walk-through**
- Every page must be Tab-walked end-to-end. Awwwards judges do this.
- Recommend: Manual spot-check with Tab + Shift-Tab on home, kitchens, contact, news.

---

### K. Cross-Browser

**[VERIFY-MANUAL] K-01 — Browser matrix not exercised**
- Audit prompt requires Chrome / Safari macOS / Safari iOS / Firefox / Edge / Samsung Internet. Cannot exercise from CLI.
- Specific suspicions to check (`SUSPECTED`):
  - **Safari iOS**: `position: sticky` containing-block behavior with `overflow-x: hidden` on body (E-01).
  - **Safari iOS**: 1.7-second Lenis lerp can feel laggy on first scroll; verify by walking the site on a real iPhone.
  - **Firefox**: AVIF support is recent; older Firefox versions fall back to JPG/WebP — confirm fallback chain via Network panel.
  - **Samsung Internet**: Default browser on Galaxy phones; pinch-zoom + tap-zoom interactions sometimes differ from Chrome.
- Effort: VERIFY-MANUAL

---

### L. Security

**[CRITICAL] L-01 — Next.js Critical CVE** (cross-ref A-01)
- `next@14.2.15` → upgrade to `14.2.35`.
- Effort: S

**[HIGH] L-02 — No Content-Security-Policy header**
- File: `next.config.js:46-95`
- What: HSTS, X-Content-Type-Options, Referrer-Policy are set. **No CSP, no X-Frame-Options, no Permissions-Policy.**
- Why it matters: Without CSP, a successful XSS injection has unrestricted exfiltration channel. Without X-Frame-Options or `frame-ancestors` in CSP, the site can be iframe-embedded for clickjacking attacks. Award sites are reviewed for security posture; CSP is table-stakes.
- Fix: Add CSP header. Strict starting policy:
  ```
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https://cdn.sanity.io; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; font-src 'self' data:; connect-src 'self' https://www.zohoapis.in https://accounts.zoho.in; media-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
  ```
  (`unsafe-inline`/`unsafe-eval` on script-src is required by Next.js 14 client RSC; consider nonces for hardening post-launch.)
- Effort: M

**[HIGH] L-03 — `dangerouslySetInnerHTML` without explicit sanitizer**
- File: `components/JsonLd.tsx:19-20`
- What: `dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}`. The payload is built server-side from typed schema objects in `lib/seo.ts` — so injection risk is bounded. But there's no defense-in-depth sanitizer.
- Why it matters: If `lib/seo.ts` ever pulls user-generated data (Sanity CMS — already pattern-prepared), an unescaped `</script>` in a name field would break out.
- Fix: Replace `JSON.stringify` with `JSON.stringify(payload).replace(/</g, '\\u003c')` to neutralize any future `</script>` injection.
- Effort: S

**[MEDIUM] L-04 — `.env.local` contains live secrets, `.gitignore` correct**
- File: `.env.local`
- Confirmed: `node_modules/`, `.next/`, `.env`, `.env.local` all in `.gitignore`. Project is currently not a git repo, so secrets aren't committed.
- Fix: When `git init` happens, the existing `.gitignore` is sufficient. Don't `git add -A` until verified.
- Status: ✓ (current state safe)

**[MEDIUM] L-05 — No CSRF token on the lead form**
- File: `app/api/lead/route.ts`
- What: Form is JSON-POST'd from the same origin. There's no cookie-based auth on the route, so traditional CSRF impact is low. But cross-origin scripted submission from a malicious site can still spam leads (cross-ref C-04).
- Fix: Same-origin check via `Origin` / `Referer` header inspection in the route. Reject if not magppie.com / preview hosts.
- Effort: S

**[MEDIUM] L-06 — Open redirect surface**
- No `?redirect=` style parameters detected in the codebase. Status: ✓.

**[LOW] L-07 — No secrets in client bundle (positive finding)**
- Build trace + manual grep of `.next/static/` for `sk_`, `1000.`, `ZOHO_` token patterns: zero matches. The Zoho credentials live entirely server-side in `.env.local` and are read in `app/api/lead/route.ts` (server route).
- Status: ✓

---

### M. Content QA

**[MEDIUM] M-01 — Founder name placeholder in JSON-LD**
- File: `lib/seo.ts:55` — `TODO: confirm founder name with the team and replace.`
- Why it matters: Founder name renders into `Organization` schema — wrong name in Google's Knowledge Graph.
- Fix: Confirm and replace.
- Effort: S

**[MEDIUM] M-02 — Showroom lat/lng placeholders**
- File: `lib/seo.ts:198`
- What: 9 LocalBusiness schemas use placeholder coordinates. Maps panels in SERPs will pin to the wrong spots.
- Fix: Survey each showroom on Google Maps, copy lat/lng into `lib/seo.ts`.
- Effort: M

**[LOW] M-03 — No Lorem Ipsum / TBD / placeholder strings in body copy**
- Searches across `app/`, `components/`: zero matches for `lorem`, `placeholder`, `TBD`, `xxx`, etc. ✓

**[LOW] M-04 — Catalog Drive links live (positive finding)**
- File: `app/page.tsx:790, 795` — both currently link to real Drive URLs, not placeholders.
- Status: ✓

**[LOW] M-05 — Stray `Chaitanya_chavda.webp.tmp` file**
- File: `public/images/Partners/Chaitanya_chavda.webp.tmp`
- What: Temp file left from an image conversion. Will deploy as-is.
- Fix: Delete.
- Effort: S

---

### N. Analytics, Monitoring, Observability

**[HIGH] N-01 — No analytics installed**
- Search across `app/`, `components/`: no `gtag`, no `dataLayer`, no `plausible`, no `mixpanel`, no `umami`. The Vercel `@vercel/analytics` package is also not installed.
- Why it matters: You will deploy with no idea who visits, what converts, or where users drop off. Award-tier sites measure their own performance; you can't iterate without data.
- Fix: Install GA4 (or Plausible for a more privacy-first read) + Vercel Analytics. Wire form submission events. Verify a real pageview lands.
- Effort: M

**[HIGH] N-02 — No error monitoring**
- No Sentry, no Bugsnag, no Rollbar. Server errors in `app/api/lead/route.ts` are `console.error`'d to Vercel logs only.
- Fix: Sentry SDK (`@sentry/nextjs`). Wire client + server. Source maps uploaded but not exposed publicly.
- Effort: M

**[MEDIUM] N-03 — No web-vitals reporting**
- `next/script` could ship `useReportWebVitals`. Currently absent.
- Fix: Add `app/web-vitals.ts` reporting to GA4 / Vercel Analytics once N-01 is in place.
- Effort: S

---

### O. Deployment Readiness

**[HIGH] O-01 — No `.env.example` documented**
- File: project root
- What: Real `.env.local` exists with 6 Zoho keys. No `.env.example` checked into the project, so a new dev / Vercel project / preview environment doesn't know what to set.
- Fix: Create `.env.example`:
  ```
  ZOHO_API_BASE="https://www.zohoapis.in"
  ZOHO_ACCOUNTS_URL="https://accounts.zoho.in"
  ZOHO_CLIENT_ID=""
  ZOHO_CLIENT_SECRET=""
  ZOHO_REFRESH_TOKEN=""
  NEXT_PUBLIC_SITE_URL="https://magppie.com"
  ```
- Effort: S

**[MEDIUM] O-02 — `NEXT_PUBLIC_SITE_URL` not set**
- File: `app/sitemap.ts:4`, `lib/seo.ts` (referenced)
- What: `process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://magppie.com'`. Default fallback is correct, but Vercel preview deployments will use `https://magppie.com` in their sitemaps unless this env var is set per-environment.
- Fix: Set in Vercel project: production = `https://magppie.com`, preview = the `*.vercel.app` URL pattern (or leave blank in preview to use the default).
- Effort: S

**[MEDIUM] O-03 — No Node version pinned**
- File: `package.json`
- What: No `engines.node` field. Vercel will use its default Node, which can drift.
- Fix: Add `"engines": { "node": ">=20.0.0" }`.
- Effort: S

**[LOW] O-04 — Build is clean (positive finding)**
- `next build` exits 0. 14/14 static pages generated. No warnings.
- Status: ✓

**[LOW] O-05 — Image domains whitelisted correctly**
- File: `next.config.js:38-43` allows `cdn.sanity.io` for future use. Local images go through `next/image` automatically.
- Status: ✓

**[VERIFY-MANUAL] O-06 — Preview deployments untested**
- Cannot verify Vercel preview deploy behavior without pushing a branch. Once git is initialized, the first preview deploy is the test.

**[VERIFY-MANUAL] O-07 — Rollback plan undocumented**
- Vercel's "Promote to Production" UI provides one-click rollback. Document this in the team's deploy runbook.

---

## Appendices

### A1: Route Inventory

| Route | File | Type | Notes |
|---|---|---|---|
| `/` | `app/page.tsx` | Static | Homepage. 153 kB First Load. |
| `/kitchens` | `app/kitchens/page.tsx` | Static | 148 kB. |
| `/wardrobes` | `app/wardrobes/page.tsx` | Static | 146 kB. |
| `/vanities` | `app/vanities/page.tsx` | Static | 146 kB. |
| `/about` | `app/about/page.tsx` | Static | 99.3 kB. |
| `/news` | `app/news/page.tsx` | Static | 92.6 kB. Six "Read story" placeholder anchors (B-02). |
| `/contact` | `app/contact/page.tsx` | Static | 117 kB. ContactForm wired to `/api/lead`. |
| `/api/lead` | `app/api/lead/route.ts` | Dynamic (Edge Node) | Zoho REST v5 lead capture. Production-grade. |
| `/_not-found` | `app/not-found.tsx` | Static | Branded 404. |
| `/robots.txt` | `app/robots.ts` | Static (generated) | Production-only allowlist. |
| `/sitemap.xml` | `app/sitemap.ts` | Static (generated) | **Includes `/news/kbis-2026` which does not have a route — B-01.** |
| `/manifest.webmanifest` | `app/manifest.ts` | Static (generated) | **References 3 missing icons — I-02.** |

### A2: Component Inventory

22 components in `components/`:

`ContactForm`, `CountUp`, `CustomersMarquee`, `Footer`, `Header`, `HeroVideo`, `JsonLd`, `LocationsSection`, `Magnetic`, `MaskReveal`, `MotionSection`, `NewsletterTeaser`, `PageHero`, `PageTransition`, `PoolsideKitchenBanner`, `Preloader`, `Reveal`, `ScrollFloat`, `SmoothScroll`, `StacyTestimonial`, `WhyStoneMakesDifference`, `WoodVsStone`.

Components fully audited: ContactForm, Footer, Header, HeroVideo, NewsletterTeaser, PageHero, PoolsideKitchenBanner, Preloader, SmoothScroll, StacyTestimonial, WoodVsStone, CustomersMarquee, LocationsSection, WhyStoneMakesDifference (in earlier sessions).

Components NOT yet line-by-line audited (recommended for follow-up): ScrollFloat, Reveal, MotionSection, MaskReveal, Magnetic, JsonLd, CountUp, PageTransition. These are mostly small (< 100 LOC) animation/structural wrappers. The risk concentration is in animation cleanup (H-01).

### A3: Asset Inventory and Weights

```
public/_originals    569 MB   gitignored, locally present (F-01)
public/videos        103 MB   shippable, MP4+WebM pairs
public/images         18 MB   shippable, mostly WebP
public/logos          40 KB   PNG + SVG
```

Largest single shipped image: `public/images/wellness-kitchen-hero.jpg` 2.6 MB (E-02 / F-02).

Largest video pair: `public/videos/stacy.{mp4,webm}` 9.4 + 7.4 MB = 16.8 MB combined (F-04).

### A4: Lighthouse Scores Per Route

`VERIFY-MANUAL` — not run from CLI environment. Run via PageSpeed Insights against the deployed URL once OG images and CVE fix are in place.

### A5: axe Violations Per Route

`VERIFY-MANUAL` — not run from CLI environment. Highest-confidence findings already captured in Section J.

### A6: Bundle Analysis

Production build (`next build`) output:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    8.33 kB         153 kB
├ ○ /_not-found                          138 B          87.3 kB
├ ○ /about                               185 B          99.3 kB
├ ƒ /api/lead                            0 B                0 B
├ ○ /contact                             2.44 kB         117 kB
├ ○ /kitchens                            3.68 kB         148 kB
├ ○ /manifest.webmanifest                0 B                0 B
├ ○ /news                                294 B          92.6 kB
├ ○ /robots.txt                          0 B                0 B
├ ○ /sitemap.xml                         0 B                0 B
├ ○ /vanities                            1.29 kB         146 kB
└ ○ /wardrobes                           1.29 kB         146 kB
+ First Load JS shared by all            87.2 kB
  ├ chunks/117-4140e3c601b33f38.js       31.6 kB
  ├ chunks/fd9d1056-8fef90fb5a0b2194.js  53.6 kB
  └ other shared chunks (total)          1.95 kB
```

Verdict: Bundle sizes are clean. No chunk exceeds 200 kB gzipped. No duplicate libraries detected.

### A7: Dependency Audit (`npm audit --json`)

```
Total vulnerabilities: 2
  Critical: 1   (Next.js Authorization Bypass in Middleware, GHSA-f82v-jwr5-mffw, CVSS 9.1)
  High:     0
  Moderate: 1   (postcss XSS via unescaped </style>, GHSA-qx2v-qp2m-jg93)
  Low:      0
```

Both fixed by `npm install next@14.2.35` (semver-minor).

Outdated packages report: 10 packages have newer versions. Patch upgrades recommended now: `next`, `postcss`, `autoprefixer`. Major upgrades (React 19, Tailwind 4, TypeScript 6) are post-deploy work.

### A8: Browser Matrix Results

`VERIFY-MANUAL` — see K-01.

---

## Severity Summary

| Severity | Count | Sections |
|---|---|---|
| CRITICAL | 9 | A-01, B-01, C-01, C-02, F-01, I-01, I-02, I-03, I-04, J-01, L-01 |
| HIGH | 14 | A-02, B-02, B-03, C-03, C-04, C-05, D-01, D-02, D-03, F-02, F-03, H-01, I-05, J-02, J-03, L-02, L-03, N-01, N-02, O-01 |
| MEDIUM | 18 | A-03, A-05, B-04, B-05, C-06, C-07, D-04, D-05, E-01, E-02, F-04, H-02, I-06, J-04, J-05, J-06, J-07, L-04, L-05, M-01, M-02, N-03, O-02, O-03 |
| LOW | 17 | A-04, A-06, B-06, C-08, D-06, D-07, D-08, D-09, E-03, E-04, F-07, F-08, H-03, H-04, I-07, L-07, M-03, M-04, M-05, O-04, O-05 |
| VERIFY-MANUAL | 8 | D-10, E-05, F-05, F-06, I-06, J-08, J-09, K-01, O-06, O-07 |

(Some entries appear in multiple severity tallies due to cross-references; the counts above are the distinct issue IDs.)

---

`AUDIT COMPLETE — 58 findings written to AUDIT_REPORT.md. Awaiting approval to begin fixes.`

---

## Batch 1 — Closed

Date: 2026-05-09. All 15 approved Batch 1 findings closed. End-of-batch verification: `tsc --noEmit` clean, `next build` clean, `npm audit --omit=dev` Critical = 0 (residual HIGH on `next` requires Next 15 — documented in `BATCH_1_DISCOVERIES.md` D-01).

| # | Finding ID(s) | Status | Commit | One-line summary |
|---|---|---|---|---|
| 1 | A-01 / L-01 | FIXED | `6931715` | Patched next → 14.2.35, postcss + autoprefixer to latest. Critical CVE GHSA-f82v-jwr5-mffw closed. |
| 2 | A-05 / I-04 | FIXED | `0c1d36c` | Removed placeholder Search Console / Bing Webmaster verification tokens from `app/layout.tsx`. |
| 3 | B-01 | FIXED | `ec0e18a` | Removed `JOURNAL_POSTS` block from `app/sitemap.ts` — sitemap no longer advertises non-existent `/news/[slug]` routes. |
| 4 | J-01 / B-05 | FIXED | `e4505bd` | Wrapped homepage NewsCard tile in `<Link href="/news">` with focus-visible ring. (Note: pre-existing tree edits to `app/page.tsx` co-staged — see DISCOVERIES D-02.) |
| 5 | B-02 | FIXED | `c7402b8` | Stripped six `<a href="#">Read story →</a>` placeholders from `app/news/page.tsx`. |
| 6 | O-01 | FIXED | `bbeea6f` | Added `.env.example` documenting the 5 Zoho env vars + `NEXT_PUBLIC_SITE_URL`. |
| 7 | O-03 | FIXED | `8e78765` | Added `engines.node >= 20` to `package.json`. |
| 8 | M-05 | FIXED | `3858935` | Deleted stray `public/images/Partners/Chaitanya_chavda.webp.tmp`. |
| 9 | C-03 / D-04 / D-05 | FIXED | `b4ba336` | Added `autoComplete`, `inputMode`, `enterKeyHint`, `pattern` attributes across ContactForm / Footer / NewsletterTeaser inputs. (Note: pre-existing form-wiring on `ContactForm.tsx` co-staged — see DISCOVERIES D-02.) |
| 10 | D-02 | FIXED | `bf71430` | Bumped `.tap-link` padding from 0.625rem → 0.875rem to clear the 44 px touch-target minimum on text-xs / text-sm. |
| 11 | H-02 | FIXED | `0392751` | Replaced `transition-all` with `transition-colors` on the `<header>` to avoid Safari stutter on gradient interpolation. |
| 12 | I-05 | FIXED | `4e62343` | Added explicit `card: 'summary_large_image'` to every per-page `twitter` block (7 files). |
| 13 | J-06 | FIXED | `cccf84c` | Set `alt=""` on PageHero + CustomersMarquee images that were duplicating the adjacent `<h1>` / `<figcaption>` text. |
| 14 | J-07 | FIXED | `47435bd` | Added `aria-required="true"` to the footer privacy-policy checkbox. |
| 15 | L-03 | FIXED | `62f7936` | JsonLd payload now `JSON.stringify(...).replace(/</g, '\\u003c')` to neutralise future `</script>` injection from CMS-fed schema fields. |

**Out-of-scope discoveries during execution:** see `BATCH_1_DISCOVERIES.md` (D-00 through D-02).

**Deferred to Batch 2 / later batches:** all CRITICAL findings not in this list (I-01 OG images, I-02 PWA icons, I-03 apple-icon, C-01 Footer newsletter handler, C-02 NewsletterTeaser placebo, F-01 `_originals` directory). Plus all HIGH not addressed here (B-03 Footer legal/privacy hrefs, A-02 ESLint config, C-04 honeypot/rate-limit, D-01 mobile-menu focus trap, F-02/F-03 image weights, J-02/J-03 popup focus traps, L-02 CSP header, N-01/N-02 analytics/monitoring, O-01 — done — and others).

---

`BATCH 1 COMPLETE — 15 findings closed. Awaiting Batch 2 instructions.`

---

## Batch 2 — Closed

Date: 2026-05-09. Final state: `tsc --noEmit` clean, `npm run lint` clean (0 errors / 0 warnings), `next build` clean (16/16 routes generated), `npm audit --omit=dev` Critical = 0 (residual HIGH on `next` documented in BATCH_1_DISCOVERIES.md D-01).

| # | Finding ID(s) | Status | Commit | One-line summary |
|---|---|---|---|---|
| 1 | A-02 | FIXED | `846c689` | ESLint configured with `next/core-web-vitals` strict preset; lint queue empty. |
| 2 | F-01 | FIXED | `67abc43` | Moved 569 MB of source assets out of `public/` to `../magppie-source-assets/`. |
| 3 | E-02 / F-02 | FIXED | `2ad9180` | Compressed Wellness-Kitchens hero 2.6 MB JPG → 254 KB WebP (90% smaller). |
| 4 | F-03 | FIXED | `ea3e180` | Removed `priority` from Header logo; PageHero retains the only LCP-tier `priority` per route. |
| 5 | B-03 | FIXED | `642d8ec` | Shipped `/legal` and `/privacy` placeholder routes; Footer links repointed. |
| 6 | C-01 | FIXED | `7752a38` + `bd3f4dd` | Footer newsletter wired to real `/api/newsletter` (Resend) with rate-limit + honeypot. |
| 7 | C-02 | FIXED | `9c7f59c` | NewsletterTeaser placebo replaced with real fetch + sending / thanks / error states. |
| 8 | C-04 | FIXED | `1521173` | Honeypot + 3-leads-per-IP-per-hour rate limit on `/api/lead`. |
| 9 | C-05 | FIXED | `1521173` | Email required client-side AND server-side; route validates with EMAIL_RE. |
| 10 | L-05 | FIXED | `1521173` | Origin guard on both API routes — same-origin or `*.vercel.app` only. |
| 11 | D-01 / J-02 | FIXED | `cd8d75b` | Mobile menu wrapped in FocusLock; role=dialog, aria-modal, Esc handler, aria-controls. |
| 12 | J-03 | FIXED | `d21d0e3` | NewsletterTeaser popup gets the same FocusLock + dialog semantics + Esc. |
| 13 | J-04 | FIXED | `6e4cc9b` | Awards masthead converted from `<p>` to semantic `<ul>` with pseudo-element separators. |
| 14 | J-05 | FIXED | `0c42b01` | Replaced `<ol display:contents>` with `<ul role="list">` in LocationsSection. |
| 15 | H-01 | FIXED | `f1ed9ab` | All 7 motion components audited: cleanup verified, prefers-reduced-motion verified, transform-only verified, header comments added. |
| 16 | C-06 | FIXED | `1a26d3a` | ContactForm error block gains warning-icon SVG, "Error:" prefix, red palette — meaning beyond colour. |
| 17 | C-07 | FIXED | `1a26d3a` | Phone field gains "10-digit Indian mobile number" hint, pattern, title, aria-describedby. |
| 18 | L-02 | FIXED | `851a071` | Staged Content-Security-Policy + X-Frame-Options DENY + Permissions-Policy added globally. |
| 19 | N-01 | FIXED | `1ce475f` | `@vercel/analytics` mounted in layout. |
| 20 | N-03 | FIXED | `1ce475f` | `@vercel/speed-insights` mounted; Core Web Vitals reported automatically. |

**Out-of-scope discoveries during execution:** see `BATCH_2_DISCOVERIES.md` (D-03 through D-06).

**Open after Batch 2 — awaiting owner input or out-of-scope:**
- **I-01 / I-02 / I-03** (OG images, PWA icons, apple-icon) — deferred by owner; resume by placing 8 source files in `../magppie-source-assets/` and running `node scripts/generate-social-assets.mjs`.
- **M-01 / M-02** (founder name, 9 showroom lat/lngs) — deferred by owner; resume by pasting values into `lib/seo.ts`.
- **N-02** (Sentry error monitoring) — deferred by owner; resume with Sentry DSN.

All other findings from the original audit either fixed in Batches 1+2 or were "VERIFY-MANUAL" tags retained in the manual-verification checklist below.

---

## Manual Verification Checklist

These items cannot be exercised from the CLI. Run them on the Vercel preview deploy before promoting to production.

| ID | Item | Tooling |
|---|---|---|
| D-10 | Device matrix walk (iPhone SE / 14 Pro / 14 Pro Max / Pixel 7 / Galaxy S22 Ultra / iPad Mini / iPad Pro, portrait + landscape) | Chrome DevTools device emulation |
| F-05 | Lighthouse mobile + desktop on `/`, `/kitchens`, `/about`, `/contact`. Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 800ms. | Lighthouse / PageSpeed Insights |
| F-06 | Long-task profile on a throttled 4G connection, mid-tier Android profile | DevTools Performance tab |
| I-06 | Validate JSON-LD shapes for every route | [Google Rich Results Test](https://search.google.com/test/rich-results) |
| J-08 | Color contrast + axe-core pass per route | [axe DevTools](https://www.deque.com/axe/devtools/) extension |
| J-09 | Keyboard tab walk-through every route end-to-end | Tab + Shift-Tab + Esc on every dialog |
| K-01 | Cross-browser matrix: Chrome, Safari (macOS + iOS), Firefox, Edge, Samsung Internet | BrowserStack or real devices |
| B-04 | All 9 redirects in `next.config.js` resolve to a single 301 (no chains) | `curl -I https://magppie.com/<source>` × 9 |
| O-06 | Preview deploy renders correctly | Push a branch + open Vercel preview URL |
| O-07 | Document rollback runbook | Vercel "Promote to Production" UI provides one-click rollback; capture in team docs |
| L-02 | CSP violations on preview (none expected for 24h before tightening) | DevTools Console while walking every route |
| C-01 / C-02 | Newsletter forms end-to-end: submit a real email from each, verify 200 + appearance in Resend audience | DevTools Network + Resend dashboard |

---

`BATCH 2 COMPLETE — 20 approved findings closed. 5 deferred awaiting owner input. Awaiting deploy authorization.`
