# Implementation status: Stage A (cinematic redesign)

Target: this worktree (the site content and animations branch), started from the latest
hybrid-hero commit (`e6deb76`). Stage B (sound, supplied films, real endpoints) is not started.

Updated: 2026-10-11. See "Verification" for what was actually run.

## Map (as implemented)

1. Foundation: live motion store (`src/lib/hooks.js`), idempotent smooth scroll (`src/lib/scroll.js`),
   Pause motion control, no preloader, no global glass/grain/tilt layers, one stylesheet system.
2. Home: seven chapters (`src/components/sections/Chapters.jsx`, `Investigation.jsx`).
3. Platform, About, Contact, Press, Privacy, Terms, 404 rebuilt in the same system.
4. Metadata, FAQ semantics, video helper, cleanup of superseded code and dependencies.

## Done

- **Motion preference** is one live source: OS reduced motion OR the visitor's Pause motion (persisted in
  localStorage, synced across tabs). `html.motion-off` stops all CSS motion; JS systems (Lenis, GSAP
  scrubs, video, canvases, widget loops) subscribe via `useMotionOff()`.
- **Smooth scroll**: `initScroll()` is idempotent and returns a cleanup; Lenis is created and destroyed as
  motion is turned on and off. No scroll lock exists any more.
- **Shell**: header follows the scene beneath it (`data-tone`), stays visible while it holds focus, has a
  persistent "Request a walkthrough" action and a Pause motion button; footer has Pause motion too.
- **Home chapters**: Opening (film + poster, no gate), Change (clarifier ring + the 02:14 readout + three
  questions), Investigation (one pin of about 265vh, stage buttons, Skip example, text summary, tap-controlled
  and unpinned on touch/narrow/paused), Product stage (selector wide, stacked narrow), Operator, People
  (typographic, no portrait), Invitation.
- **Staged components completed**: `viz/loop.css` and `viz/days.css` were missing in the source checkout and
  are now written; all `viz` widgets re-render when the motion preference changes.
- **Platform**: product-led opening with anchors `#lite #pulse #field`, workflow, bet, knowledge base,
  technology, layer stack, daily questions, idea (Days), reach, getting started, FAQ.
- **About**: editorial; founder account is typographic. **Contact**: form in the first view, labelled
  "Open email draft", field-level errors tied to inputs, first invalid field focused, copyable fallback,
  data-transfer advice. **Press**: honest clipboard feedback; logo downloads are real files in `/brand`.
  **Legal**: quiet reading layout with contents, text and draft status unchanged. **404**: one ring motif.
- **Cleanup**: removed Hero/Motion/Backdrop/FlutedGlass, old widgets, and the unused effect components;
  `ogl` and `motion` dependencies uninstalled after confirming nothing imported them.
- **CSS**: `global.css`, `hybrid.css`, `corporate.css`, `motion-home.css` replaced by `site.css`
  (tokens, shell, chapters, pages). `imagery.css` pruned. `viz/*.css` kept.

## Remaining / deferred

- Stage B: sound, original films, real contact or newsletter endpoint, company evolution timeline.
- No verified company milestones were supplied, so About has no evolution timeline.
- No founder portrait, team photograph, real product screenshots or attributable proof were supplied.

## Owner content questions (not resolved here, claims left as they were)

- "No hardware" (Home/Platform assurances) versus Hydris Field on smart glasses.
- "Useful on day one" versus "weeks of configuration".
- Founded 2025 (Press boilerplate) versus founder left previous work June 2026.
- Single tenancy versus learning that "travels" between plants.
- "Millions of litres under management" versus read-only advisory control. Left as an existing claim in
  the People chapter; there is no measurement or permission on file.
- Official wordmark artwork reads "HYDRIS AI" while all copy says "Hydris".
- Privacy text mentions a monthly note (the sign-up was removed from the site) and says analytics providers
  are not selected although Vercel Analytics and Speed Insights are installed. Terms mention press
  materials that are only available on request. Both documents are still marked as drafts for counsel.
- Product availability states are not supplied, so no product is labelled available or planned.

## Metadata

All eight entries carry a canonical URL (`https://www.hydris.ai/...`, no trailing slash, matching the sitemap
and `cleanUrls`), `og:url`, `og:image` (`/brand/og.png`, 1200x630, brand mark only) with width, height and
alt text, and Twitter large-image tags. `404.html` is `noindex` with no canonical. `theme-color` is the
mineral background. `src/styles/motion-home.css` (staged, never imported, its component never existed) was
removed from this branch; it is still in the `hybrid-hero` checkout.

## Verification

Run on 2026-10-11 against the Vite dev server in the in-app browser, plus a production build.

Desktop (1440x900), motion on:
- Home: opening, change and readout, investigation stages 1 to 4, product stage selector, operator, people,
  invitation, header tone over light and dark scenes. Page height 9,495px (was 27,580px).
- Platform, About, Contact, Press, Privacy, 404 read through and rendered correctly. Terms uses the same
  layout as Privacy and was only checked for overflow and load.
- Pause motion (header): Lenis destroyed, progress bar removed, film replaced by its poster, no pinned
  spacers, nothing left hidden, preference stored as `hydris:pause-motion`; turning it off restored motion.
- Investigation while paused: stage buttons change the scene, focus stays on the pressed button,
  `aria-current="step"` moves, the live summary updates, "Skip example" points at an existing `#products`.
- Contact: submitting empty focuses the first invalid field and marks name, email and message with
  `aria-invalid` and linked error text. With valid values, "Copy the request" reports honestly when the
  clipboard is unavailable.
- Press: all six logo files return 200; the preview link is now hidden from keyboard and screen readers and
  the visible link is named per file.

Mobile: Home at 390x844 (opening, change, investigation in tap mode, product stack, operator, invitation) and
every route at 360px: no horizontal overflow. Contact form is usable at 360px.

Build: `npx vite build` passes for all eight pages. No em-dashes in `src` or the HTML entries.

Not covered:
- No real touch device, Safari, Firefox, screen reader or Lighthouse run. Speed Insights and Analytics are
  only active once deployed.
- The in-app browser throttles animation frames, so some screenshots caught reveals mid-way; state was
  confirmed afterwards from computed styles.
- The dev server does not serve `404.html` for unknown paths; that is Vercel's job once deployed.
- Mailto hand-off ("Open email draft") was not exercised because it would open a mail client.
- Keyboard-only walk-through of the pinned Investigation on a fine pointer was not done beyond focus and
  stage-button checks.
