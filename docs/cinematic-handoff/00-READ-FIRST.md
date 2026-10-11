# Hydris cinematic redesign: how to use this packet

Reviewed 10 October 2026. The current site identified by the owner is **http://localhost:4307/**. Its server runs from **`E:\Startup\Hydris\website\hydris-hybrid`**. The original chat folder, `website-v1-7102026`, and the public website are different versions. The implementation prompt explicitly targets the correct project.

This packet contains a review and implementation instructions. No website code has been redesigned in this task.

## The recommendation

Build **From signal to judgment**: plant → signal → captured expertise → reasoning → operator decision → institutional memory. Keep Operational Water Intelligence as the positioning. Make customers the primary audience; founder history, authentic proof, company evolution, and clear technology explanations also serve investors.

The current website already has cinematic mechanics. Its long logo reveal, clarifier aperture, horizontal plant sequence, five-stage process, marquees, global glass, and 15 numbered Home sections compete for time and attention. The stronger transformation is a continuous seven-chapter story, with real product screens and people carrying the proof.

## Files

| File | Purpose | What Claude should read |
|---|---|---|
| `01-CLAUDE-MASTER-PROMPT.md` | Comprehensive design, page, motion, engineering, and verification brief | Read once for Stage A |
| `02-ASSET-CHECKLIST.md` | Detailed table, quantities, capture specifications, shot list, audio direction, and timeline intake | Owner collects assets; read only when using supplied material |
| This file | Findings, priorities, launcher, and optional follow-up prompts | Owner run guide |

## What to improve across the whole site

| Surface | Current finding | Enhancement | Delivery |
|---|---|---|---|
| Opening | Simulated Calibrating gate; proposition/CTA appear late in a long logo sequence | Shorten the mark reveal; show the product meaning and next action immediately | Stage A |
| Home architecture | 15 numbered chapters plus extra sequences; repeated arguments and multiple long pins | Consolidate to seven purposeful chapters; relocate technical depth to Platform | Stage A |
| Narrative motion | Effects often act independently | Give water, plant geometry, evidence, and human judgment a shared visual grammar | Stage A |
| Product demonstration | Illustrative widgets/readout; no supplied real product captures | One coordinated evidence story; real Lite/Pulse/Field screens when supplied | Stage A with existing material; real assets when ready |
| Knowledge base | Strong claim, largely abstract presentation | Show the mechanism and an approved real artifact/source example | Stage A illustration; original evidence when supplied |
| Human control | Important read-only/operator story already exists | Place it at the resolution of the investigation; connect it to actual operator imagery | Stage A |
| Platform | Long conceptual opening and technical claims; limited interface proof | Start with tangible product evidence; retain architecture, daily questions, and deployment details deeper in the page | Stage A |
| Field | Smart glasses are described without a real product demonstration | Show actual guidance, hardware/workflow, and observation feedback; clarify product-specific requirements | Stage A structure; assets needed |
| About | Founder story exists, without original founder/team photography | Editorial Vetri spread, real team images, dated evolution, useful principles | Stage A with existing text; assets when supplied |
| Company evolution | No dedicated dated archive | 4–6 verified milestones with prototype/plant/work artifacts; distinguish current from planned | Stage A if supplied; otherwise Stage B |
| Proof | “Millions of litres” and live plant claims lack an attributable public evidence layer | Contextual approved proof, actual scope/date, method, and customer permission | Content dependency |
| Contact | Form follows topic cards and a large image; mailto labelled Send message | Put form near top, retain plant/press/work routing, label Open email draft, improve errors/fallback | Stage A |
| Newsletter | Subscribe opens an email request; no actual provider | Accurate request wording now; real signup/unsubscribe when a provider exists | Stage A wording; Stage B integration |
| Press | Existing boilerplate/bio and copy buttons; described assets are requested by mail | Actual logo downloads, correct clipboard feedback, real portraits/kit when supplied | Stage A |
| Legal | Review-labelled drafts; analytics/provider and newsletter details need reconciliation | Quiet reading design; preserve draft content pending approved replacements | Stage A presentation; owner content dependency |
| 404 | Decorative error experience | Simple visual connection to the brand with immediate recovery links | Stage A |
| Navigation | Compact links and Talk to us action; motion can interfere with controls | Consistent dark/light treatment, obvious CTA, reliable focus and mobile navigation | Stage A |
| Motion/accessibility | No unified pause; reduced motion is sampled once; desktop process can still pin | New persistent pause, live preferences, useful static/touch versions, stable controls | Stage A |
| Performance | Heavy cine variants and several persistent effects | One opening film, poster/Save-Data fallback, correct offscreen pause, fewer global canvases | Stage A |
| Sharing | Missing canonical/OG URL/image/Twitter metadata | Verified route metadata and a designed social preview | Stage A; share artwork if supplied |
| Sound | No integrated soundtrack | User-activated ambient music, optional place ambience, off by default | Stage B |

## Protect the remaining Claude allowance

Use the Sonnet model available in your account for implementation. Check `/model` and `/usage` in Claude Code. Anthropic recommends Sonnet for most coding, explains that context grows with the session, and distinguishes `/compact` for ongoing work from `/clear` for changing tasks. [Official model and context guidance](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code).

The reported 50% is an allowance indicator, not a guarantee of 2.5 hours of coding or a predictable number of prompts. I cannot see the account meter. This packet reduces repeated discovery and competing concept work; it cannot guarantee the entire project fits before a reset.

Treat these as planning priorities, not measured consumption forecasts:

| Share of the remaining effort | Focus |
|---|---|
| Roughly 65% | Shared visual system, coherent Home story, one signature example, complete supporting pages |
| Roughly 25% | Production build, desktop/mobile checks, functional/a11y fixes |
| Roughly 10% | Reserve for unexpected defects and a useful continuation handoff |

Avoid spending the remaining allowance on a fresh architectural debate, multiple independent concepts, 3D scenes on every route, an asset-generation pipeline, new backend infrastructure, or repeated full-site polish loops. Specific file targets and verification conditions help keep work focused. [Anthropic cost-management guidance](https://code.claude.com/docs/en/costs).

## Run Stage A

1. Preserve any current work before starting. Use the actual `hydris-hybrid` project, not the older chat folder.
2. Supply the minimum asset pack if ready. Do not hold the whole redesign for optional music or films. Current text/illustrations remain usable while missing material is listed in the handoff.
3. Start Claude Code in the correct project. Use a fresh focused session if its existing history is unrelated; preserve any needed decisions before clearing. Paste this launcher:

```text
The current Hydris website is http://localhost:4307/ and its actual source is E:\Startup\Hydris\website\hydris-hybrid. Work in that project, preserving existing changes and the running server.

Read docs/cinematic-handoff/01-CLAUDE-MASTER-PROMPT.md once and implement Stage A. Customers are the primary audience; investors are secondary. I have about 50% of my current five-hour allowance left. Use the supplied direction, reuse the current stack, finish all routes with one coherent system, and reserve room for build/browser verification. Do not start Stage B or produce competing concept essays. Keep a compact implementation status file so work can resume if the allowance ends.
```

4. Check usage after the first coherent implementation pass. Do not paste the entire master again in follow-ups.
5. If defects remain, send one consolidated correction with affected page/state and a screenshot if useful. Do not ask vaguely for “even more premium” in a loop.

If using ordinary Claude chat instead of Claude Code, it needs actual source access to implement. A localhost link alone does not give a remote chat access to the app. Supply a source bundle excluding `node_modules`, `.git`, secrets, generated `dist`, and large unchanged media; include package/config files, HTML entry points, `src`, and relevant brand/media filenames. Provide a few screenshots for visual reference. Ask for complete changed files and patch instructions, and apply/build them locally. Do not upload every encoded video or 168 photo variants as conversation context. Claude Code is the more direct route for this existing local project.

## Optional follow-up prompts

Use only the relevant follow-up after Stage A. These are not instructions to run all enrichment work automatically.

### Add approved product and people assets

```text
Continue the current Hydris design. Read IMPLEMENTATION-STATUS.md and the supplied ASSET-NOTES.md, then inspect only the components affected by these assets. Integrate the approved Lite/Pulse/Field captures and real people imagery into the existing product/founder/team sections. Preserve production/prototype/illustrative labels, use optimized web variants, and keep text readable. Add the approved 4–6 milestone timeline with real dates. Do not redesign the whole site or invent missing material. Build and check the affected desktop/mobile views once, fix observed defects, and update the status file.
```

### Add optional sound

```text
Add the supplied licensed ambient track to the existing Hydris site as Stage B. Default sound off; load and play only after the visitor activates Sound on. Provide clear keyboard-accessible mute/volume controls, modest volume, short fades, hidden-tab pause, and graceful playback failure. Do not auto-enable sound across page navigation or synchronize the site's basic usability to the soundtrack. Reuse the existing motion preferences. Test off/on/mute, navigation, keyboard, mobile, and blocked playback; build and report actual results.
```

### Connect a real contact/newsletter service

```text
Integrate the provided existing endpoint/provider into the current Hydris contact/newsletter flow. Preserve topic-specific recipients and collect only the intended fields. Add accurate loading, success, failure, retry, validation, and accessibility states. Show confirmation only after a real successful response. Keep email fallback. Do not introduce a new paid vendor or publish policy changes without approved text. Use a test endpoint/mode to verify where available; do not send a real inquiry or subscription without authorization. Update the status file and report configured dependencies.
```

### Resume after a usage reset

```text
Resume Stage A from docs/cinematic-handoff/IMPLEMENTATION-STATUS.md. Read the master prompt only if the status lacks a necessary constraint, then inspect only changed/incomplete files. Preserve the chosen direction and existing work. Complete the listed essentials, run the production build, and resolve the recorded verification failures. Do not restart discovery, propose new concepts, or begin optional Stage B work.
```

## Content to clarify before claiming more

Provide an approved truth sheet for Field hardware requirements; the meaning of useful on day one after configuration; the 2025 founding/June 2026 founder chronology; current product availability; the basis and wording of deployment volume; and the relationship between private tenancy and generalized learning. The site already contains these assertions. The redesign should explain them accurately rather than silently invent a resolution or increase the claims.

The distinctive result will come from the combination of the founder's real history, Hydris's real product mechanism, original working imagery, and a well-paced demonstration. Music and effects can enrich that foundation after the core experience is finished.
