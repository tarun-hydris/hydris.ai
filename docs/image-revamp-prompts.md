# Hydris website: image revamp brief

Each entry gives the image currently on the site (open it to compare), where it appears, the exact
size and crop to deliver, and a generation prompt. Paste the **house style** block after every
prompt so the whole set feels like one photographer shot it.

Deliver every image at **2400 px wide or more**, as JPG at quality 90 or above, or PNG. Keep the file
names listed below and I will build the web sizes from them.

---

## House style (append to every prompt)

> Photorealistic editorial documentary photography for a premium industrial water technology
> company. Shot on a full-frame camera, 35mm or 50mm prime lens, natural light only, true-to-life
> colour, gentle contrast, deep clean shadows, no HDR look, no oversaturation. Palette leans to
> deep water ink (#07161B), slate (#2A4148), muted teal (#6F9493) and clean whites, with warm light
> only where the sun naturally falls. Calm, precise, credible and quietly optimistic, in the style
> of a corporate annual report and not stock photography. Modern, well maintained, real
> infrastructure. People shown are diverse, professional, wearing correct PPE (hard hat, hi-vis
> where appropriate, gloves), and absorbed in their work rather than posing or smiling at the
> camera. Generous negative space for overlaid text. No text, no logos, no watermarks, no brand
> names, no signage lettering, no lens flare, no motion blur, no fisheye, no illustration, no
> CGI look.

**Negative prompt (for tools that take one):** text, letters, logo, watermark, signature,
cartoon, illustration, 3d render, plastic skin, extra fingers, distorted hands, oversaturated,
HDR, neon, sci-fi glow, cluttered, dirty, derelict, rust stains, staged smile, looking at camera,
stock photo, vignette, tilt-shift, low resolution.

---

## Home

### 1. `clarifier-snow`: Act I, the view from above (most important)
- **Current:** [public/photos/clarifier-snow-2000.webp](../public/photos/clarifier-snow-2000.webp)
- **Where:** a full-screen photo that opens from a circle as you scroll. Text sits bottom-left over it.
- **Deliver:** 3200 x 2400 (4:3). **The clarifier must be a perfect circle**, centred horizontally,
  slightly above the vertical centre, and about 42% of the image width across. Plain surroundings,
  and darker at the bottom for the text.
- **Prompt:** Exact top-down drone photograph, camera pointing straight down at 90 degrees, of a
  single large circular wastewater clarifier in winter. The tank is a perfect circle of dark,
  glassy, deep blue-black water with a thin concrete rim and a slender steel bridge reaching from
  the edge to the centre well. Around it lies an untouched field of fresh white snow with soft
  blue shadows, a few fine tyre tracks and a small rectangular service building cropped at the top
  edge. Early morning, low winter sun from the left raking gently across the snow. Graphic,
  minimal, symmetrical, hushed. The bottom quarter of the frame falls slightly darker into shadow.

### 2. `lite`: Products, Hydris Lite (See)
- **Current:** [public/film/lite-1280.webp](../public/film/lite-1280.webp)
- **Where:** product row, about 7/12 of the page width, rounded frame, caption "Sample data".
- **Deliver:** 2560 x 1440 (16:9). **The best result here is a real high-resolution screenshot of
  Hydris Lite with sample data** (browser zoom 150% or above, 2560 px wide). Generation is a fallback only.
- **Fallback prompt (a scene, not the screen):** Over-the-shoulder photograph of a plant
  operations engineer at a clean, bright control-room desk beside a large window overlooking
  circular treatment tanks in soft morning light. A wide monitor shows a clean, light-themed web
  dashboard with white cards, a green circular score gauge, small line charts and teal accents.
  The screen content is softly out of focus and completely unreadable. Shallow depth of field, the
  person's shoulder and hair framing the left edge, calm and focused, white and pale grey interior.

### 3. `pulse`: Products, Hydris Pulse (Understand)
- **Current:** [public/film/pulse-1280.webp](../public/film/pulse-1280.webp)
- **Deliver:** 2560 x 1440. A real screenshot of Pulse answering a question is best.
- **Fallback prompt:** Close side-angle photograph of a process engineer in a navy work shirt
  reading a monitor in a quiet plant office at dusk, lit by the screen and a window behind. The
  screen shows a light interface with a short chat question bubble in blue at the top and a single
  clean card below containing a smooth area chart that dips and then rises in amber, plus three
  small round check icons. All text is unreadable. Thoughtful, investigative mood, cool blue hour
  outside, warm desk lamp out of frame.

### 4. `field`: Products, Hydris Field (Act)
- **Current:** [public/film/field-1280.webp](../public/film/field-1280.webp)
- **Deliver:** 2560 x 1440. A first-person view through smart glasses.
- **Prompt:** First-person point-of-view photograph through augmented reality smart glasses
  inside a bright, clean pump room at a water treatment plant. A gloved hand in a blue nitrile
  glove reaches toward a large analogue pressure gauge on blue-painted pipework with stainless
  valves and a centrifugal pump in soft focus behind. A subtle, elegant translucent heads-up overlay
  floats beside the gauge: a thin glowing teal ring around the dial and a small frosted-glass
  panel with a green check mark. The overlay is minimal and believable, not sci-fi, with no
  readable text. Daylight from high windows, slight edge vignette of the glasses frame.
  *(Keep the overlay text-free; I can add "4.2 bar, reading captured" as real text.)*

### 5. `handover`: Knowledge that remains
- **Current:** [public/film/handover-1280.webp](../public/film/handover-1280.webp)
- **Where:** right half of the section, rounded frame, beside "Hydris keeps what a plant knows."
- **Deliver:** 2400 x 1600 (3:2).
- **Prompt:** Intimate close-up of a shift handover in a plant control room at dawn. An older
  operator's weathered hand passes a worn, dark leather-bound logbook across a clean desk to a
  younger colleague's hand in a navy work-shirt sleeve. On the desk: a ceramic mug and a pen pot.
  Behind, softly blurred, a window shows blue early light over the plant and a monitor glows faintly.
  Warm desk-lamp light on the hands and book, cool blue background. Tender, respectful, a sense
  of continuity and trust. Hands are anatomically perfect.

### 6. `stewardship`: Beyond the plant, Hydris Stewardship
- **Current:** [public/film/stewardship-1280.webp](../public/film/stewardship-1280.webp)
- **Deliver:** 2400 x 1260 (about 1.9:1). The subject sits right of centre.
- **Prompt:** A sustainability manager in a smart navy blazer stands in a bright, immaculate
  beverage bottling hall, holding a tablet that shows a clean light interface with a small world
  map, coloured status dots and a list of rows (all unreadable). Behind, out of focus, long rows
  of clear glass bottles move on a stainless steel conveyor under tall windows. White, airy,
  hygienic, morning light, shallow depth of field, only hands, shoulder and part of the face
  visible. No brand labels on the bottles.

### 7. `portfolio`: Beyond the plant, Hydris Portfolio
- **Current:** [public/film/portfolio-1280.webp](../public/film/portfolio-1280.webp)
- **Deliver:** 2400 x 1260.
- **Prompt:** Two senior executives seen in near silhouette stand before a floor-to-ceiling
  window at golden hour in a high-rise office. One gestures toward a large wall display showing a
  dark, elegant map of a country with many small glowing site markers in teal, amber and a few red,
  connected by fine lines, with a slim column of horizontal bars at the right edge (no readable
  text). Outside, a soft hazy landscape with a river. Calm and strategic, premium, deep shadows,
  warm rim light.

### 8. `river`: Closing, full screen behind "Built for every drop"
- **Current:** [public/film/river-1280.webp](../public/film/river-1280.webp)
- **Deliver:** 3840 x 2160 (16:9). It runs full screen with text bottom-left, so keep the lower-left
  third calm and darker. The subject sits right of centre.
- **Prompt:** A family at the edge of a wide, clean river at golden hour: a mother walking along a
  grassy bank path, a father holding a small child's hand, two children laughing as they splash
  ankle-deep in the shallows, and a wooden boat resting on the bank. Warm low sun backlighting
  the water into glowing gold, gentle mist across the far bank, lush green grass. Natural, joyful,
  unposed, dignified. Wide composition with the family in the right half and quiet water and
  shadow in the lower left.

### 9. `poster`: cover image of the film player
- **Current:** [public/film/poster-1280.webp](../public/film/poster-1280.webp)
- **Deliver:** 2560 x 1440. The logo will be added as real artwork, so generate the scene only.
- **Prompt:** A perfectly still lake at first light, mirror-flat water reflecting a thin band of
  sunrise along a dark, wooded far shore, delicate mist lying low on the surface, a deep
  blue-slate sky fading to pale gold at the horizon. Vast, quiet, contemplative. Strong empty
  centre for a logo.

---

## Platform

### 10. `aerial-river`: band under the opening
- **Current:** [public/photos/aerial-river-2000.webp](../public/photos/aerial-river-2000.webp)
- **Deliver:** 3840 x 1650 (about 21:9).
- **Prompt:** High oblique drone photograph of a modern industrial water treatment plant on the
  bank of a broad river: circular clarifiers, rectangular aeration basins and clean low process
  buildings, surrounded by trees. Late afternoon light, long soft shadows, water in the tanks
  reflecting the sky in deep teal. Orderly, well kept, calm. The river curves out of frame on the right.

### 11. `hands-valve`: Field product panel
- **Current:** [public/photos/hands-valve-1400.webp](../public/photos/hands-valve-1400.webp)
- **Deliver:** 2000 x 2500 (4:5 portrait).
- **Prompt:** Close-up of an operator's hands in blue nitrile gloves fitting and tightening a
  stainless steel valve on a clean blue water line, with a pressure gauge and pipework softly
  blurred behind. Side window light, crisp detail on the metal and gloves, cool palette with a
  touch of warm light. Purposeful, skilled, precise.

### 12 to 14. "Reach" mosaic: one plant, a second site, every site
- **Current:** [aerial-green](../public/photos/aerial-green-2000.webp) ·
  [riverside](../public/photos/riverside-2000.webp) · [aerial-bank](../public/photos/aerial-bank-2000.webp)
- **Deliver:** 3 images at 2400 x 1800 (4:3). They must look like one series: same altitude, same
  light and same colour grade.
- **Prompt 12 (`aerial-green`, "One plant"):** Top-down drone photograph of a compact treatment
  plant with three circular tanks set in a bright green meadow, clean geometric shapes, soft morning light.
- **Prompt 13 (`riverside`, "A second site"):** Top-down drone photograph of a mid-size
  riverside plant with long rectangular settling basins and two circular clarifiers beside a calm
  river, the same morning light and grade.
- **Prompt 14 (`aerial-bank`, "Every site, on one basis"):** Top-down drone photograph of a
  large plant along a river embankment, many circular and rectangular tanks in an orderly grid,
  the same morning light and grade, a sense of scale.

### 15. `plant-fog`: Platform closing band (and Press)
- **Current:** [public/photos/plant-fog-2000.webp](../public/photos/plant-fog-2000.webp)
- **Deliver:** 3840 x 2160. It sits full screen behind white text, so keep the centre calm and mid-dark.
- **Prompt:** Aerial view at dawn of a treatment plant with domed digester tanks and circular
  clarifiers emerging from a soft blanket of morning mist, the first sun warming the mist pink and
  gold, the surrounding forest in deep blue shadow. Serene, atmospheric, cinematic.

---

## About

### 16. `crew-clarifier`: band under the opening
- **Current:** [public/photos/crew-clarifier-2000.webp](../public/photos/crew-clarifier-2000.webp)
- **Deliver:** 3840 x 1650 (21:9).
- **Prompt:** High oblique drone photograph of three operators in white hard hats and hi-vis
  vests walking along the steel bridge of a very large circular clarifier, the water a smooth dark
  teal disc with radial ripples, morning light, long thin shadows across the water. A strong sense
  of human scale against infrastructure.

### 17. `outfall`: "What we are protecting"
- **Current:** [public/photos/outfall-2000.webp](../public/photos/outfall-2000.webp)
- **Deliver:** 2000 x 2500 (4:5 portrait).
- **Prompt:** Treated, crystal-clear water pouring in smooth glassy ribbons from a row of clean
  outfall pipes into a calm channel. Fine spray catches the morning backlight, the concrete is clean,
  green reeds sit at the edges, and the water below is clear enough to see stones. Pure and
  accountable. Fast shutter so the water shows texture without blur.

### 18. `plant-night`: About closing band
- **Current:** [public/photos/plant-night-2000.webp](../public/photos/plant-night-2000.webp)
- **Deliver:** 3840 x 2160.
- **Prompt:** Aerial blue-hour photograph of a large treatment plant lit by warm sodium and white
  LED lights, circular tanks glowing softly, reflections on the still water, the dark river and
  forest around it, the deep blue sky just after sunset. Quiet, vigilant, a plant that never sleeps.

### 19. Founder portrait sequence
- **Current:** `public/founder/` (9 frames)
- **Do not generate.** Use a real photo session of the founder: 9 frames, same position, a slight
  head turn from left to right, neutral background (a clean plant setting or plain light grey),
  soft window light. Portrait 4:5, 2000 x 2500.

---

## Also worth upgrading
- **Opening video (`public/video/cine-*`):** a 10 to 15 second seamless loop of slow,
  dark, glossy water surface movement in 4K, filmed or generated, with no camera shake. It fills the
  Hydris mark, so rich texture and highlights matter more than composition.
- **The film itself:** the site now plays the 720p version. A 1080p or 4K export of the
  platform film would make the player and every still sharper.

## When you send them
Drop the files anywhere (for example `0. assets/revamp/`) with the names above. I will swap them in,
rebuild the responsive sizes and placeholders, and check every crop on desktop and phone.
