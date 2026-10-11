# Hydris cinematic redesign: master implementation prompt

Copy the text below into Claude Code, or ask it to read this file once. This is an implementation brief for the existing repository. Stage A is the requested first delivery. Stage B is a separate, optional enrichment pass after Stage A passes verification. The companion asset checklist is for collecting material; Claude does not need to read it during Stage A unless new assets have been supplied.

---

You are the design director, creative developer, and frontend engineer for Hydris. Transform the existing website into a complete cinematic experience with precise product storytelling, authentic human credibility, exceptional typography, and disciplined interaction design. Implement the result in this repository. Do not finish with recommendations, a mockup, or a homepage disconnected from the other routes.

## 1. Outcome and scope

Primary audience: plant owners, water operations leaders, and operators evaluating Hydris. Secondary audience: investors, strategic partners, and journalists. Customers come first. The existing CTA is **Talk to us**; use **Request a walkthrough** as the proposed clearer evaluation action, while preserving the contact destination and the assessment offer. An evaluator must quickly understand what Hydris does, see how an investigation works, understand that the operator retains control, and find a useful next step.

The creative direction is **From signal to judgment**. Preserve the existing **Operational Water Intelligence** positioning. The website should feel like entering a living water system, observing a change, applying captured expertise, gathering evidence, arriving at a human decision, and preserving what was learned. Physical imagery establishes the world; product evidence explains the mechanism; people establish the company. Every major visual and motion choice should support that sequence.

The distinction must come from a story only Hydris can substantiate, original imagery where available, and careful craft. Treat award-level execution as the quality bar. Do not solve this with a generic dark SaaS template, decorative space particles, a pile of unrelated effects, or vague claims of being revolutionary.

Complete all existing pages: Home, Platform, About, Contact, Press, Privacy, Terms, and 404. Give each a distinct composition within one coherent system. Preserve their URLs and useful anchors. The hero, investigation, and product explanations deserve the highest creative effort; supporting routes should be complete and polished with simpler choreography.

## 2. Usage-conscious execution contract

I have approximately 50% of my current five-hour Claude allowance remaining. You cannot translate that into a guaranteed token count, number of messages, or duration. Use a bounded scope and preserve room for fixing defects.

- Read this brief once. Inspect the named files and relevant implementations selectively. Avoid rereading the entire repository, printing asset manifests with embedded base64, dumping lockfiles, or generating lengthy analysis.
- Use one resolved creative direction. Start with an implementation map of at most 150 words, then implement. Do not spend the allowance producing competing concepts or repeating the brief back to me.
- Use one primary agent for this pass unless a small, isolated delegation demonstrably reduces work. Do not create an open-ended team, research loop, or multiple simultaneous redesigns.
- Reuse the installed stack and media pipeline. Do not migrate the framework, routing, hosting, or build architecture. Do not add a 3D framework, shader pipeline, CMS, authentication, or backend to achieve the cinematic result.
- Finish Stage A before starting any Stage B feature. If constrained, simplify decorative choreography and omit unverified material while finishing the core pages and controls. Keep a working build at each substantial checkpoint.
- Verify in one batched desktop/mobile pass, fix the observed defects together, and perform one confirmation pass. Repeat only to resolve an actual remaining failure. Stop when the acceptance criteria pass.
- Keep final output concise: implemented changes, build and browser results, missing assets, material limitations, and any clearly deferred features. Never claim an unfinished essential is complete.
- Leave a compact `docs/cinematic-handoff/IMPLEMENTATION-STATUS.md` after the initial map and update it after verification or interruption, with completed work, remaining work, changed files, and verification results. This should enable continuation without another broad audit.
- Preserve existing uncommitted changes. Do not reset, clean, publish, deploy, buy assets, or configure paid services as part of this request. Leave the owner's existing localhost server intact.

## 3. Repository facts and inspection map

**The current website the owner explicitly identified is `http://localhost:4307/`. Its actual source root is `E:\Startup\Hydris\website\hydris-hybrid`. Work in that root.** The original chat working directory, `website-v1-7102026`, and the public `hydris.ai` site are different versions. Do not accidentally redesign either of those. Confirm the target root and current files before editing; do not infer source identity from the chat's initial directory.

This project is React 19 and Vite 6, with static multi-page HTML entry points, lazy React page imports, GSAP/ScrollTrigger, Lenis, Motion, OGL, Vercel Analytics, and Speed Insights. Existing scripts are `npm run dev`, `npm run build`, and `npm run preview`; there is no established test/lint suite to invent for this visual change.

Inspect:

- `package.json`, `vite.config.js`, `vercel.json`, and `src/main.jsx` for build, routes, and deployment constraints.
- `src/lib/content.js` for existing product, founder, company, and legal copy. Treat website claims as the current content baseline and flag material ambiguities; do not expand them without evidence.
- `src/components/layout/Layout.jsx` for header, compact mobile navigation, footer, preloader, and analytics.
- `src/components/sections/Hero.jsx`, `Blocks.jsx`, `Sections.jsx`, and `Imagery.jsx`, plus `src/components/widgets/Widgets.jsx`, for the current narrative, process, product rows, hotspots, and readout.
- All eight files under `src/pages/` and the HTML entry points for route-specific behavior and metadata.
- `src/components/ui/Photo.jsx`, `Primitives.jsx`, `Brand.jsx`, `Motion.jsx`, `Backdrop.jsx`, and `FlutedGlass.jsx`, plus `src/lib/hooks.js` and `scroll.js`.
- The three CSS imports in `src/main.jsx`: global, imagery, and hybrid. Establish one clear token source and remove superseded overlapping styles as components migrate; do not append another override layer.
- `public/brand/`, `public/photos/`, and `public/video/` for reusable assets. Read `src/lib/photos.js` selectively and inspect cine paths in `Hero.jsx`, without printing low-quality image placeholders/base64.

The actual photo manifest has 44 subjects with 168 responsive WebP files. There is one cinematic video subject, `cine`: 1080 H.264 approximately 4.74MB, 1920 AV1 approximately 5.92MB, 1920 H.264 approximately 8.95MB, and a roughly 61KB WebP poster. Preserve responsive Photo primitives. Cine playback exists in Hero, without a shared Video component; improve its capability selection, poster/decode fallback, Save-Data handling, and offscreen pausing. Do not assume the other checkout's nine-video library or Investigation component exists here.

The current experience already includes a logo-mask video reveal, a Calibrating preloader, a clarifier aperture, horizontal plant stages, a five-step process, hotspots/readout, marquees, global glass, and grain. Home has 15 numbered sections plus surrounding sequences. The splash occupies approximately 280vh desktop/240vh mobile, and the aperture adds another approximately 280vh. The central problem is long, disconnected pacing and weak authentic product/people evidence, not a lack of cinematic effects.

## 4. Product truth and editorial boundaries

Preserve the brand name **Hydris**, existing vector marks, and the source rule against em dashes in website copy. The actual products are:

| Product | Current role and vocabulary |
|---|---|
| Hydris Lite | Operational intelligence: Configure, Score, Standardise; plant configuration and daily intelligence |
| Hydris Pulse | Expert reasoning: Diagnose, Recommend, Predict; reasoning and suggested actions |
| Hydris Field | Field execution: Guide, Execute, Feed back; hands-free guidance on smart glasses and observations feeding the knowledge loop |

Hydris helps teams interpret plant data, investigate problems, and decide what to check next. Operators retain responsibility for decisions and control changes. Do not imply autonomous plant control, a confirmed diagnosis, guaranteed compliance, certified security, universal integrations, or measured savings without supplied evidence.

The existing 02:14 plant readout and origin diagram are **illustrative, not live plant data**. Keep that label visible beside each demonstration and preserve its meaning on mobile. Remove random pseudo-live values from explanatory examples; use an internally coherent, repeatable scenario. Stock plant images are atmospheric illustration, not proof of Hydris customers. Generated UI must be labelled as a concept or illustrative workflow; it cannot impersonate a real product screenshot.

Product-specific availability remains unspecified even though Home claims live plant use. Use approved availability states if supplied; otherwise retain an invitation to discuss the applicable product. Do not invent launch dates or label every product generally available.

About already names **Vetri Dhagumudi, Founder and Chief Executive**, includes his industrial water experience and origin story, and says he left his previous work in June 2026. Team copy mentions water engineers, process specialists, and software people across the US and India. Preserve these existing accounts; founder/team photographs, a dated company archive, real product screenshots, and attributable deployment evidence are the missing layer. Use only actual supplied new material. Retain existing useful copy when photographs are missing. Record gaps in the handoff, not as visible lorem ipsum, imaginary people, invented dates, broken downloads, or empty cards.

Preserve the curated expert knowledge base and the Data → Understand → Reason → Act → Learn mechanism. Flag these current content tensions for an owner truth sheet without guessing a resolution: blanket no-hardware claims versus Field smart glasses; useful on day one versus weeks of configuration; founded 2025 versus founder departure June 2026; single tenancy versus shared learning; “millions of litres under management” versus read-only advisory control. These facts can sometimes coexist. Do not automatically delete them or strengthen them into guarantees. Keep existing claims contextual, record what needs approval, and never introduce invented metrics, client logos, certification badges, or additional deployment assertions.

## 5. Visual direction

Build an industrial field atlas expressed through film: expansive water/plant imagery, precise evidence graphics, strong editorial typography, and small instrument-like annotations. The visual grammar moves from fluid and physical to measured and legible, then back to the human world.

- Open in a deep water/ink atmosphere. Transition into pale mineral surfaces for product evidence and company reading. Return to an atmospheric closing scene. Give background changes narrative purpose; avoid alternating colours mechanically.
- Suggested starting palette: deep ink `#07161B`, mineral white `#F3F3EC`, subdued slate `#8EA4AD`, existing Hydris blue as the signal accent. Use muted teal only where it helps hierarchy. Confirm readable text, focus, and chart contrast; these values are direction, not excuses for inaccessible combinations.
- Current fonts are Inter Tight and Hedvig Letters Serif. Use their contrast deliberately: concise technical/display headings and occasional editorial founder quotations. Inter for body and Geist Mono for annotations are optional new choices, not already loaded assets. Keep at most a disciplined small set, with performant font loading. A licensed custom font may replace display type only if supplied. Do not download a commercial font without a licence or add five competing families.
- Desktop display headings should be large but carefully composed, roughly 72–112px where space permits. Mobile roughly 38–54px. Use `clamp()` and deliberate line breaks; no cropped letters, giant empty screens, or headings that obscure the proposition.
- Use a strong desktop grid, fluid gutters, and a simple mobile grid. Alternate full-bleed film, asymmetrical editorial spreads, and precise product stages. Avoid a repeated grid of rounded benefit cards.
- Pair each scene with one clear idea. Use restrained rules, chapter numbers, short captions, and real chart notation. Decorative labels must not imply live telemetry, real customer counts, or unsupported operational measurements.
- Keep UI screenshots sharp, mostly front-facing, and large enough to read. Show details through crops or a focused enlargement. Avoid extreme perspective, tiny screen mockups, glossy device piles, and overlays covering the actual interface.
- Preserve recognisable Hydris marks. Use the existing SVGs at crisp sizes with ample space. Do not redraw the logo, turn it into plain text, or apply distortion that makes it illegible.
- Light, texture, crops, pacing, and composition should carry the atmosphere. Film grain, glows, and blur are minor accents if used at all. Do not make text hazy or place a global animated noise layer over the site.

## 6. Home: one coherent journey

Use the following seven chapters. Combine adjacent content where it improves pace. Keep every section valuable when motion is disabled.

### Chapter 1: The living system

Create an opening with real moving water or plant footage, a legible Hydris mark, the current approved headline, a short explanatory sentence, and immediately usable actions: **Request a walkthrough** and **See an example**. The first viewport must communicate AI for industrial water operations without scrolling. A suggested poster should provide the same composition before playback.

Evolve the current logo-mask opening into a shorter, useful entrance. Use a slow crop or scale change and controlled typography. Reveal the proposition and CTA immediately rather than at the late 0.58–0.82 part of the current scroll timeline. Remove the simulated Calibrating progress gate and unnecessary scroll lock. Use a subtle scroll cue if helpful. Expose Pause motion in Stage A; show a sound control only when Stage B audio actually exists.

### Chapter 2: The change

Bring the plant into view with existing clarifier photography, the current aperture composition, and original plant footage if supplied. As the visitor advances, the circular form of a clarifier can be visually echoed by the next measurement graphic, and a flowing line can become the time axis. Achieve the relationship through composition, SVG, crossfades, and transforms; do not build a costly fluid simulation or frame-seeking video scrubber. The aperture should become a short transition rather than another long pinned scene.

Present one approved operating question clearly, using the existing 02:14 drifting-reading story or a newly supplied scenario. Establish that a signal needs plant context. Do not introduce a specific ammonia scenario, real diagnosis, or engineering thresholds without the supporting content. Include the existing three evaluation questions where useful: is it working, where is it heading, and how much should we trust the available evidence?

### Chapter 3: The investigation, the signature interaction

Unify the existing process in `Blocks.jsx`/`Widgets.jsx` with the illustrative readout in `Sections.jsx`. Turn Data → Understand → Reason → Act → Learn into one coordinated story instead of separate long demonstrations. The visitor-facing investigation can progress through:

1. **Data and context.** Show the relevant reading and the sources surrounding it: control-system history, lab results, procedures, and shift observations where supported.
2. **Captured expertise and reasoning.** Show how the existing expert-knowledge-base story connects the evidence to possible explanations. Use actual sources when provided; invented document titles must not appear as real citations.
3. **The next check and human decision.** Reveal the approved suggestion and its uncertainty, then show the operator choosing what to do. Avoid implying the website gives operating instructions for a real facility.
4. **Institutional memory.** Show the recorded observation/outcome feeding back into the plant's knowledge, using an illustrative completion if no measured outcome exists. Do not imply one customer's files are pooled into another customer's tenancy.

Use one coordinated desktop scroll sequence, approximately 240–300vh total including its reading space if the composition supports it. This should replace multiple long pinned tracks rather than add to them. Provide stage buttons and a clear **Skip example** action to the next useful chapter. Buttons must work by keyboard and update the selected stage accurately. Scrolling back should reverse or restore the visual state predictably.

On touch screens and when motion is paused/reduced, use readable stacked stages or tap-controlled steps with a static chart. Avoid compulsory pinning, sideways scrolling, tiny axis labels, flashing alerts, typing delays, and nested scrolling. Keep the illustrative label adjacent to the graphic in every state. Provide a textual summary so understanding does not depend on the animation.

### Chapter 4: The product becomes tangible

Introduce Lite, Pulse, and Field with their established purposes. Give each a concise job, input/context, output or assistance, and action to the appropriate Platform content. Use real screenshots if provided; otherwise use the current honest illustration, not an invented realistic dashboard.

At desktop sizes, an editorial selector may update one large product stage. It must also respond to focus, keyboard activation, and touch. The first item is visible by default. On mobile, use vertical product sections rather than hover-dependent previews. Make the interface or diagram the proof, not an anonymous abstract texture.

### Chapter 5: The operator

Return from software to people: hands reviewing a note, inspecting equipment, or working at the plant. State **Your team stays in control** and explain what that means in plain language. Use existing `hands-valve`, `operators`, `crew-rounds`, `crew-clarifier`, `crew-weir`, or supplied original material accurately. Preserve the human-control message without framing operators as a cost to remove. Show real Field smart-glasses imagery here or in its product section if supplied.

Use the existing cost, risk, and knowledge themes selectively, with concrete implications and no invented outcome figures. Integrate them into the narrative instead of giving every benefit its own full-screen animation.

### Chapter 6: The people behind Hydris

Add a short editorial founder/company moment using Vetri's existing reason for starting Hydris, a real portrait if supplied, and a link to About. A compact evolution preview may show two or three verified dated milestones. Do not duplicate the complete About timeline here. If photographs are absent, design a strong typographic account around the existing biography rather than deleting the founder story or inventing a likeness.

Verified customer/pilot evidence may appear here or beside the relevant product claim. Use the real context, source, date, and permission. A lack of quantified outcomes is not a reason to invent them.

### Chapter 7: The invitation

Close with a calm water/plant scene, **Let’s talk about your plant**, one sentence about the assessment, the primary CTA, and a useful email fallback. Preserve the current offer to review existing plant data while making the first conversation and agreed transfer arrangements clear. Do not solicit operating-file uploads through a generic contact form. Summarize the current configuration journey using its approved timing and scope; do not turn product ambitions into delivery guarantees. The CTA must remain easy to reach without waiting for a final animation.

## 7. The supporting pages

### Platform

Use a product-led opening with a screenshot or an honest evidence graphic, followed by the operating workflow. Move the detailed knowledge-base, deterministic/probabilistic reasoning, explainability, three daily questions, data architecture, site/group reach, and implementation material here from the long Home page, retaining current product meaning. Explain the three products using readable interfaces, short scenarios, and their available states when confirmed. Each product needs a name, audience/job, what information it uses, what help it offers, and a clear next step using only supplied facts. Field requires actual guidance/observation imagery and an accurate account of any smart-glasses requirements.

Include an accessible screenshot enlargement or click-to-play recording if the material exists. A modal must have a visible close button, Escape handling, focus management, and focus restoration. Do not load a long recording before the visitor asks for it.

Preserve existing anchors and add useful product/workflow anchors without breaking incoming links. Answer integration, hardware, deployment, data sharing, setup, and pricing questions from the current copy or supplied truth sheet. Do not manufacture detailed promises because the layout wants them. Keep the current annual-per-site/setup commercial model unless corrected by the owner; add no invented price. Keep the assessment journey and operator responsibility clear.

### About

Compose this as an editorial company story: the operating problem, Vetri's existing water-scarcity origin and industry experience, evolution, actual team, and principles. Use real people as the visual authority when material exists. The founder spread should include his existing name, role, relevant biography, and attributed account with a supplied portrait. Do not invent cofounders or additional credentials.

Hydris evolution should be a clean vertical dated sequence with 4–6 factual milestones and optional archival imagery. Labels must distinguish completed work, current work, and future plans. A prototype is not a deployed customer result. A proposed partnership is not a signed partnership. A simple reading timeline is sufficient for Stage A.

Use one team photograph and selected work images rather than an invented roster. Principles must explain decisions in the product. Investors should learn the mechanism and trajectory through these facts; avoid creating a fundraising pitch, market size, traction counter, or valuation that was not supplied.

### Contact

Put the request flow near the top, in an inviting and readable composition, rather than below route cards and a large image band. Preserve topic routes for plant/press/work, full name, work email, optional company and industry, and the message. Support autocomplete, required-field semantics, error associations, focus on the first invalid field, and descriptive errors. Add clear advice to agree transfer arrangements before sending confidential plant data.

No submission backend currently exists. Rename **Send message** to an honest **Open email draft** action and explain that the visitor must send it. Keep topic-specific recipients. Offer an obvious address and a copyable request as an optional fallback. Do not show **Request received** after launching a mail client. A supplied real endpoint or scheduling URL may be integrated in Stage B; it requires actual loading, success, failure, and retry handling.

Describe the next conversation using approved information. Do not invent a response SLA, call duration, free trial, or guaranteed assessment. Keep general and press contacts separate. Make the layout work with the mobile keyboard and at 200% zoom.

### Press

Create a restrained press page with the existing boilerplate, founder biography, copy controls, press contact, and supplied company facts. Correct copy feedback so a failed clipboard write does not report success. The current Downloads section describes materials but offers a mailto kit request. Provide logo/wordmark downloads from existing actual files, and retain an accurately labelled request for unavailable material. Add founder photographs, a fact sheet, product captures, or a press-kit archive only if the files and intended usage are supplied. No dead download buttons or invented media coverage. Keep original download files separate from compressed presentation images where practical.

### Privacy and Terms

Use the new typography and navigation with quiet, readable layouts, short line lengths, headings, and an optional contents list. Avoid cinematic scrolling effects on legal reading.

Both documents currently identify themselves as drafts requiring review. Preserve their substantive text and review status unless approved replacements are supplied. Flag for the owner the newsletter's actual mailto workflow and unsupported one-click unsubscribe promise, unselected analytics despite existing Vercel tools, corporate location/provider facts, and editorial permissions. Do not silently certify or rewrite legal facts, jurisdiction, or policy claims. Redesigning their presentation is part of Stage A; resolving company/legal facts remains a documented content dependency.

### 404

Use one quiet visual gesture from the new system and immediate home/contact recovery. Retain an accessible page title and readable 404 indication. Reduce or remove costly decorative canvas effects if they do not serve the new direction. Verify `404.html` and unknown-route behavior in production preview, inspect existing static-host configuration, and record deployment-level verification as pending until deployed.

## 8. Motion and interaction system

Use GSAP/ScrollTrigger for coordinated narrative timelines and CSS for ordinary states. Reuse Motion only where the current component warrants it. Avoid multiple systems controlling the same transform or scroll position.

- Buttons/focus states: approximately 120–220ms. Section entrances: approximately 450–750ms. Large image settles: approximately 800–1200ms. Use one consistent easing language and short stagger groups.
- Motion explains connection, hierarchy, or transition. Do not animate every line, every card, and every scroll pixel. Keep body copy stable and readable.
- The site uses ordinary document scrolling. Preserve wheel, touch, keyboard, anchors, browser back, and scroll restoration. Lenis must never create a scroll trap. Disable smoothing where necessary for motion preferences.
- One primary pinned story on Home; other routes use normal flow. No mandatory horizontal galleries, custom cursor, pointer-tracking main text, or full-screen menu with slow forced entrances.
- Header stays legible on dark/light scenes, indicates the active route, and provides a persistent useful CTA. Current mobile navigation uses compact links; preserve that if it fits, or introduce an accessible menu only if needed. Any menu needs correct expanded state, Escape dismissal, focus behavior, and scroll-lock cleanup.
- Add a new visible **Pause motion** control that stops decorative video, loops, CSS animation, parallax, WebGL/canvas backgrounds, and GSAP ambient motion. No unified pause currently exists. Selected stage changes still work instantly; paused motion must not hide content. Persist the preference across route navigation where practical.
- React to changes in `prefers-reduced-motion` while the page is open. Handle coarse pointers, touch, Save-Data, hidden tabs, failed video playback, and narrow/short screens. The static version must feel intentionally designed.
- Keep focused content visible when headers hide/show or when anchors are activated. Do not move a button away from the keyboard focus point through magnetic effects.

## 9. Stage B: audio and richer material

Implement these only in a separately requested enrichment pass after Stage A passes, or when explicitly supplied and the owner chooses that pass.

**Sound:** optional instrumental ambient music, water texture, and restrained plant ambience. Default off. Show a plainly labelled **Sound off/on** control; begin playback only after the user activates it. Lazy-load audio after that action, handle blocked playback without errors, use a modest volume and short fade, and pause on hidden tabs. Do not automatically restart sound on navigation. The experience must communicate fully in silence. No unlicensed popular music, alarming sirens, excessive UI clicks, or required narration.

**Original films:** swap in approved plant/people footage through the cine playback/helper optimized in Stage A. Add a click-to-play product or founder film with captions/transcript where speech exists. Do not create a generation pipeline or external video purchase flow.

**Company archive:** deepen the factual evolution timeline with early sketches, previous prototypes, photographs, and dated artifacts. Keep future work separate from completed milestones. Do not build a complex 3D historical museum.

**Proof:** add approved case studies and testimonials with scope, dates, outcome methodology, and permission. Give measured outcomes the surrounding context; do not imply all facilities achieve the same result.

**Real conversion service:** integrate a provided working form endpoint or booking link, with a genuine confirmation and failure path. Do not embed a fake calendar or request confidential operating files through a generic contact form.

**Newsletter:** the existing monthly-note Capture is mailto-only. In Stage A, label it as an email subscription request and remove unimplemented instant-subscription/unsubscribe promises from marketing UI, while flagging legal text for approval. In Stage B, connect an actual supplied list provider and implement confirmed signup and unsubscribe behavior. Do not silently add a new vendor.

## 10. Engineering, performance, and accessibility

- Keep static MPA HTML entry points and build inputs. Verify direct route loads, refresh, browser history, hash targets, and trailing-slash behavior. Inspect configured hosting headers and record deployment verification as pending. Do not replace this with an SPA shell.
- OGL is actually installed and used by current effects. Reuse or simplify an existing effect where appropriate; do not delete its dependency blindly. Remove unused code/configuration only after confirming it is no longer referenced.
- Make `initScroll` idempotent with cleanup for its GSAP ticker and global listeners. Scope GSAP work with contexts and dispose ScrollTriggers, observers, timers, and events on cleanup. No duplicate controllers or perpetual animation work in hidden sections.
- Consolidate design tokens and scoped styles. Reuse media and brand primitives. Keep narrative data centralized; avoid brittle nth-child text replacement or styles depending on copy length. Repair the redundant `.splash--still .splash--still .splash__say` selector and ensure later absolute-position overrides cannot break the static fallback.
- Preserve image dimensions and responsive `srcset`/`sizes`. Improve cine selection and poster/failure fallback, near-viewport loading, and offscreen pause. Prioritize one opening visual, not every video. Below-fold films use lazy attachment; prevent layout shifts while media loads. Handle both document visibility and element visibility so a hidden-tab return does not restart an offscreen film.
- Do not load desktop media on small screens when a smaller variant exists. The existing 1080 cine is approximately 4.74MB; avoid preloading it on Save-Data/reduced-motion visits where a poster suffices. Aim for new hero posters around 150–250KB and small loop encodes around 1–3MB when achievable without damaging the image. These are new-asset targets, not a demand to reencode the entire library. Report actual payload where tools permit.
- Aim for LCP at or below 2.5s, CLS at or below 0.1, and INP at or below 200ms in representative conditions. These are targets, not results to claim without measurements. Report test conditions and distinguish lab checks from field data.
- Use one semantic h1 per page, ordered headings, appropriate links/buttons, visible focus, sufficient text/control contrast, and meaningful alt text for real product/people imagery. Decorative visuals use empty alt/appropriate hidden semantics.
- Support keyboard use, screen readers, 200% zoom, and readable content at 360px widths. Prefer touch targets around 44px. No controls available only on hover or distinguished only by colour.
- Replace broad form tilt and magnetic operational controls from `Alive` with stable form/button interactions. Bound the fixed full-page `Backdrop`/two-pass `FlutedGlass` and remove redundant decorative grain/canvases. A fixed canvas is always in the viewport, so IntersectionObserver alone does not suspend it during reading. Pause decorative work on hidden tabs and motion preference changes.
- Fix FAQ semantics: accurate expanded state, associated labelled answer regions, and hidden/inert collapsed content as appropriate. Do not merely collapse visual height while leaving inactive answer controls focusable.
- Add canonical URL, `og:url`, `og:image`, image alt, and Twitter card metadata to each actual HTML entry point using verified production URLs and a supplied/generated brand-only share image. Add structured company data only for verified fields. Keep sitemap and robots consistent.
- Preserve existing analytics. If adding events, capture CTA/example interactions without form content or plant information, prevent duplicate handlers, and do not introduce a new tracking vendor.

## 11. Stage A acceptance and handoff

Stage A is complete when the whole site shares the new visual system, the Home story and investigation work, products are understandable, supporting pages are coherent, and the following checks pass or an actual limitation is clearly recorded:

1. `npm run build` succeeds; no missing imports, assets, fatal console errors, or dead links introduced by the redesign.
2. All eight templates open directly. Primary/mobile navigation, menu if introduced, footer, walkthrough links, anchors, and 404 recovery work.
3. One desktop and one mobile pass cover all routes, with representative sizes near 1440×900 and 390×844; spot-check 360px, tablet layout, short viewport, and 200% zoom for relevant overflow risks.
4. Investigation stages work with scroll, buttons, keyboard, and touch. Skip works. Reduced-motion/paused versions are useful. No pinning traps or layout jumps.
5. Product selection works without hover; screenshots are readable and enlarge correctly if a viewer exists. FAQ and any modal have correct focus/state behavior.
6. Contact invalid fields receive useful errors and focus. Mailto mode is labelled honestly. If a real endpoint was supplied, success and failure are actually tested without sending a real inquiry unless authorized.
7. Pause motion stops every decorative system. Audio remains off until activation if Stage B was separately implemented.
8. No fabricated founder, team, customer, benchmark, capability, availability state, legal approval, or missing-asset placeholder appears publicly.
9. Available browser/performance checks are reported with their actual conditions. Do not report a Lighthouse score or field metrics you did not measure.
10. Provide a concise changed-file summary, verification results, missing owner-supplied content, and deferred Stage B work. Include screenshots of the finished homepage and a representative mobile view if your tools support them.

Now inspect the named implementation, provide the short implementation map, and complete Stage A. Do not start Stage B automatically. Optimize for a memorable, coherent, usable result that can be verified within this session.
