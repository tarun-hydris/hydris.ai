import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CineVideo from '../ui/CineVideo.jsx';
import Icon, { Arrow } from '../ui/Icon.jsx';
import { Frame, Photo } from '../ui/Photo.jsx';
import { Reveal, Words } from '../ui/Primitives.jsx';
import { Days } from '../viz/Days.jsx';
import { KnowledgeBase } from '../viz/KnowledgeBase.jsx';
import { Readout } from '../viz/Readout.jsx';
import { PHOTOS } from '../../lib/photos.js';
import {
  ABOUT, CHANGE, CTA, EMAIL, INVITE, KNOWLEDGE, LOOKS, MATTERS, OPENING, OPERATOR, PEOPLE, PLATFORM,
  PRODUCT_STAGE, PRODUCTS, PROOF,
} from '../../lib/content.js';
import { useInView, useMedia, useMotionOff, useReady } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------------------------------------
   Chapter 1. The living system. Real water footage, the mark, the line, and the action, in the first
   viewport. No loading gate and no pinned scroll: the footage settles, the words rise, and when you
   leave, the film drifts away slightly. Poster and footage share one composition.
   ------------------------------------------------------------------------------------------------ */
export function Opening() {
  const root = useRef(null);
  const ready = useReady();
  const off = useMotionOff();

  useEffect(() => {
    if (off || !root.current) return undefined;
    const ctx = gsap.context(() => {
      const trigger = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.open__film', { scale: 1.1, yPercent: 5, ease: 'none', scrollTrigger: trigger });
      gsap.to('.open__inner', { yPercent: -6, opacity: 0.25, ease: 'none', scrollTrigger: trigger });
    }, root);
    return () => ctx.revert();
  }, [off]);

  return (
    <section ref={root} className={`open ${ready ? 'is-in' : ''}`} data-tone="dark" aria-label="Hydris">
      <div className="open__film" aria-hidden="true"><CineVideo className="open__vid" priority /></div>
      <div className="open__shade" aria-hidden="true" />
      <div className="open__inner grid">
        <p className="s-label open__label">{OPENING.label}</p>
        <Words as="h1" text={OPENING.title} className="open__title" delay={0.1} />
        <Reveal as="p" className="lead open__sub" delay={0.45}>{OPENING.sub}</Reveal>
        <Reveal className="open__cta" delay={0.6}>
          <a className="pill pill--light" href={CTA.href}>{CTA.label} <Arrow /></a>
          <a className="link-u open__example" href={CTA.exampleHref}>{CTA.example} <Arrow dir="down" /></a>
        </Reveal>
      </div>
      <a className="open__scroll" href="#aperture" aria-label="Scroll to the next chapter">{OPENING.scroll} <Arrow dir="down" /></a>
    </section>
  );
}

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ------------------------------------------------------------------------------------------------
   The aperture. A full-bleed photograph that opens from one of its own circles: the clarifier is the
   first thing you see, then the view widens to the whole plant as you scroll. Only the zoom, no
   decoration. With motion paused the whole photograph is simply shown with its caption.
   ------------------------------------------------------------------------------------------------ */
export function Aperture({ name, circle, kicker, title, end, endSmall }) {
  const p = PHOTOS[name];
  const off = useMotionOff();
  const track = useRef(null);
  const stage = useRef(null);
  const clip = useRef(null);
  const img = useRef(null);
  const intro = useRef(null);
  const outro = useRef(null);

  useEffect(() => {
    if (off || !track.current) return undefined;
    let g = null;
    let last = 0;

    const measure = () => {
      const w = stage.current.clientWidth;
      const h = stage.current.clientHeight;
      const s = Math.max(w / p.W, h / p.H);
      const iw = p.W * s;
      const ih = p.H * s;
      const dx = (w - iw) / 2;
      const dy = (h - ih) / 2;
      const cx = dx + circle.x * iw;
      const cy = dy + circle.y * ih;
      const rImg = circle.r * iw;
      const r0 = Math.min(rImg, 0.23 * Math.min(w, h) + 0.04 * Math.max(w, h));
      const far = Math.max(Math.hypot(cx, cy), Math.hypot(w - cx, cy), Math.hypot(cx, h - cy), Math.hypot(w - cx, h - cy));
      g = { w, h, dx, dy, iw, ih, cx, cy, rImg, r0, k0: r0 / rImg, far };
      // The scaled layer is the whole photograph (not the screen), so on a portrait screen the cropped
      // parts are still there to be revealed and its edge never shows inside the circle
      const el = img.current.style;
      el.inset = 'auto';
      el.left = `${dx}px`; el.top = `${dy}px`; el.width = `${iw}px`; el.height = `${ih}px`;
      el.transformOrigin = `${circle.x * iw}px ${circle.y * ih}px`;
    };

    const render = (prog) => {
      last = prog;
      if (!g) return;
      const { w, h, dx, dy, iw, ih, cx, cy, r0, k0, far } = g;
      const t = ease(clamp((prog - 0.08) / 0.74));
      const k = lerp(k0, 1, clamp(t * 1.35));
      let r = lerp(r0, far + 2, Math.pow(t, 1.35));
      if (k < 1) {
        // Never open past the edge of the (still scaled down) picture
        const L = cx - (cx - dx) * k; const R = cx + (dx + iw - cx) * k;
        const T = cy - (cy - dy) * k; const B = cy + (dy + ih - cy) * k;
        let cap = Infinity;
        if (L > 0) cap = Math.min(cap, cx - L);
        if (R < w) cap = Math.min(cap, R - cx);
        if (T > 0) cap = Math.min(cap, cy - T);
        if (B < h) cap = Math.min(cap, B - cy);
        r = Math.min(r, cap);
      }
      clip.current.style.clipPath = `circle(${r.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`;
      img.current.style.transform = `scale(${k.toFixed(4)})`;

      const io = clamp((prog - 0.06) / 0.22);
      intro.current.style.opacity = 1 - io;
      intro.current.style.transform = `translateY(${(-io * 40).toFixed(1)}px)`;
      const oo = clamp((prog - 0.74) / 0.16);
      outro.current.style.opacity = oo;
      outro.current.style.transform = `translateY(${((1 - oo) * 30).toFixed(1)}px)`;
      // The header follows what is under it: pale paper first, the dark photograph once it has opened
      track.current.dataset.tone = t > 0.55 ? 'dark' : 'light';
    };

    measure();
    render(0);
    const st = ScrollTrigger.create({
      trigger: track.current, start: 'top top', end: 'bottom bottom',
      onRefresh: (self) => { measure(); render(self.progress); },
      onUpdate: (self) => render(self.progress),
    });
    const ro = new ResizeObserver(() => { measure(); render(last); });
    ro.observe(stage.current);
    return () => { st.kill(); ro.disconnect(); };
  }, [off, circle.r, circle.x, circle.y, p.H, p.W]);

  if (off) {
    return (
      <section id="aperture" className="aperture aperture--static sec" data-tone="light" aria-label={kicker}>
        <div className="aperture__still">
          <Frame name={name} sizes="100vw" drift={0} ratio="16 / 9" />
        </div>
        <div className="aperture__static grid">
          <p className="s-label">({kicker})</p>
          <p className="t-s">{title}</p>
          <p className="lead mute">{end} {endSmall}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="aperture" className="aperture" ref={track} data-tone="light" aria-label={kicker}>
      <div className="aperture__stage" ref={stage} style={{ '--bg': p.bg }}>
        <div className="aperture__clip" ref={clip}>
          <div className="aperture__img" ref={img} style={{ backgroundImage: `url("${p.lqip}")` }}>
            <Photo name={name} sizes="100vw" alt={p.alt} />
          </div>
          <div className="aperture__veil" aria-hidden="true" />
        </div>
        <div className="aperture__intro grid" ref={intro}>
          <p className="s-label aperture__kicker">({kicker})</p>
          <p className="t-m aperture__title">{title}</p>
        </div>
        <div className="aperture__outro grid" ref={outro}>
          <p className="t-m aperture__end">{end}</p>
          <p className="lead aperture__small">{endSmall}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Chapter 2. The change. The reading that begins to move, one approved operating question, and the
   three questions every morning answers.
   ------------------------------------------------------------------------------------------------ */
export function Change({ index = '02' }) {
  const off = useMotionOff();
  return (
    <section id="change" className="change sec" aria-label={CHANGE.label}>
      <div className="change__head grid">
        <Reveal as="p" className="s-label change__label">({index}) {CHANGE.label}</Reveal>
        <Words as="h2" text={CHANGE.title} className="t-l change__title" />
        <Reveal as="p" className="lead change__lead" delay={0.15}>{CHANGE.lead}</Reveal>
      </div>

      <div className="change__row grid">
        <div className="change__readout">
          <Readout key={off ? 'still' : 'live'} />
          <Reveal as="p" className="body mute change__note" delay={0.2}>{LOOKS.lead}</Reveal>
        </div>
      </div>

      <div className="change__qs grid">
        <Reveal as="p" className="s-label change__qlabel">{CHANGE.questionsLabel}</Reveal>
        <ol className="change__list">
          {PLATFORM.gets.rows.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 0.08} className="change__q">
              <span className="change__qn">{String(i + 1).padStart(2, '0')}</span>
              <span className="change__qt">{r.title}</span>
              <span className="change__qr">{r.role}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Chapter 4. The product becomes tangible. A selector on a wide screen, three plain sections on a
   narrow one. The first product is shown by default; the selector answers keyboard, focus and touch.
   Each stage is a concept illustration, labelled as one, until real captures are supplied.
   ------------------------------------------------------------------------------------------------ */
function FieldConcept() {
  return (
    <div className="concept">
      <Frame name="hands-valve" ratio="4 / 5" sizes="(min-width: 901px) 30vw, 90vw" position="50% 40%" drift={0.06} reveal={false} className="concept__photo" />
      <div className="concept__card" aria-hidden="true">
        <p className="concept__tag">{PRODUCT_STAGE.concept}</p>
        <ul>
          {PRODUCTS[2].verbs.map((v, i) => (<li key={v}><span>{String(i + 1).padStart(2, '0')}</span>{v}</li>))}
        </ul>
      </div>
    </div>
  );
}

function ProductVisual({ k, active }) {
  if (k === 'lite') return <KnowledgeBase layers={KNOWLEDGE.layers} />;
  if (k === 'pulse') return <Days active={active} />;
  return <FieldConcept />;
}

function ProductPanel({ i, active }) {
  const p = PRODUCTS[i];
  const s = PRODUCT_STAGE.items[i];
  return (
    <div className="prod">
      <div className="prod__copy">
        <Icon name={p.icon} className="prod__ico" />
        <h3 className="t-s prod__name">{p.name}</h3>
        <p className="s-label prod__role">{p.role}</p>
        <p className="lead prod__text">{p.text}</p>
        <ul className="prod__verbs">{p.verbs.map((v) => <li key={v}>{v}</li>)}</ul>
        <dl className="prod__dl">
          <div><dt className="s-label">{PRODUCT_STAGE.uses}</dt><dd>{s.uses}</dd></div>
          <div><dt className="s-label">{PRODUCT_STAGE.gives}</dt><dd>{s.gives}</dd></div>
        </dl>
        <a className="link-u prod__next" href={`/platform/#${s.key}`}>{PRODUCT_STAGE.next}: {p.name} <Arrow /></a>
      </div>
      <div className="prod__viz" aria-hidden="true">
        <ProductVisual k={s.key} active={active} />
        <p className="prod__concept">{PRODUCT_STAGE.concept}</p>
      </div>
    </div>
  );
}

export function ProductStage({ index = '04', title = PRODUCT_STAGE.title, lead = PRODUCT_STAGE.lead, stack = false }) {
  const [sel, setSel] = useState(0);
  const wide = useMedia('(min-width: 901px)') && !stack;
  const [ref, inView] = useInView({ rootMargin: '80px' });
  return (
    <section id="products" className="pstage sec" aria-label={PRODUCT_STAGE.label}>
      <div className="pstage__head grid">
        <Reveal as="p" className="s-label pstage__label">({index}) {PRODUCT_STAGE.label}</Reveal>
        <Words as="h2" text={title} className="t-l pstage__title" />
        <Reveal as="p" className="lead pstage__lead" delay={0.12}>{lead}</Reveal>
      </div>

      {wide ? (
        <div className="pstage__body grid" ref={ref}>
          <ul className="pstage__list" aria-label="Products">
            {PRODUCTS.map((p, i) => (
              <li key={p.name}>
                <button type="button" className={`pstage__btn ${i === sel ? 'is-on' : ''}`} aria-pressed={i === sel} aria-controls="pstage-panel" onClick={() => setSel(i)}>
                  <span className="pstage__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pstage__nm">{p.name}</span>
                  <span className="pstage__rl">{p.role}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="pstage__panel" id="pstage-panel" key={sel}>
            <ProductPanel i={sel} active={inView} />
          </div>
        </div>
      ) : (
        <div className="pstage__stack">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.name} className="pstage__item" id={PRODUCT_STAGE.items[i].key}>
              <ProductPanel i={i} active />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Chapter 5. The operator. From software back to the people. The message is plain: Hydris reads, and
   the only thing that changes a setting is a person who decided to. Cost, risk and knowledge follow
   as three short lines, not three more full-screen scenes.
   ------------------------------------------------------------------------------------------------ */
export function Operator({ index = '05' }) {
  return (
    <section id="operator" className="operator" data-tone="dark" aria-label={OPERATOR.label}>
      <div className="operator__bg" aria-hidden="true">
        <Photo name="crew-clarifier" sizes="100vw" position="50% 45%" alt="" className="operator__img" />
      </div>
      <div className="operator__shade" aria-hidden="true" />
      <div className="operator__inner grid">
        <Reveal as="p" className="s-label operator__label">({index}) {OPERATOR.label}</Reveal>
        <Words as="h2" text={OPERATOR.title} className="t-l operator__title" />
        <Reveal as="p" className="lead operator__lead" delay={0.15}>{OPERATOR.lead}</Reveal>
        <Reveal as="p" className="operator__line" delay={0.25}>{OPERATOR.line}</Reveal>
        <ul className="operator__cols">
          {MATTERS.principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={0.1 + i * 0.1} className="operator__col hl">
              <span className="operator__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-row">{p.title}</h3>
              <p className="body">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Chapter 6. The people. Vetri's reason for starting Hydris, in his words and as the page's one
   editorial moment. No portrait has been supplied, so the account is typographic; nothing is invented.
   ------------------------------------------------------------------------------------------------ */
export function People({ index = '06' }) {
  return (
    <section id="people" className="people sec" aria-label={PEOPLE.label}>
      <div className="people__grid grid">
        <Reveal as="p" className="s-label people__label">({index}) {PEOPLE.label}</Reveal>
        <Words as="h2" text={PEOPLE.title} className="t-m people__title" />
        <Reveal as="figure" className="people__quote" delay={0.1}>
          <blockquote>{ABOUT.founder.quote}</blockquote>
          <figcaption className="s-label">{ABOUT.why.cite}</figcaption>
        </Reveal>
        <div className="people__text">
          <Reveal as="p" className="lead" delay={0.1}>{ABOUT.why.lede}</Reveal>
          <Reveal as="p" className="body mute" delay={0.18}>{ABOUT.team.text}</Reveal>
          <Reveal delay={0.24}><a className="link-u" href={PEOPLE.moreHref}>{PEOPLE.more} <Arrow /></a></Reveal>
        </div>
        <Reveal className="people__now hl" delay={0.15}>
          <p className="s-label">{PROOF.eyebrow}</p>
          <p className="body">{PROOF.lead}</p>
          <p className="body mute">{PROOF.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Chapter 7. The invitation. A calm night scene, one sentence, the action, and an email fallback.
   Reused as the closing of every page (with a different title where the page asks for one).
   ------------------------------------------------------------------------------------------------ */
export function Invitation({ photo = 'plant-night', title = INVITE.title, text = INVITE.text }) {
  return (
    <section className="invite" data-tone="dark" aria-label={INVITE.label}>
      <div className="invite__bg" aria-hidden="true">
        <Photo name={photo} sizes="100vw" position="50% 50%" alt="" className="invite__img" />
      </div>
      <div className="invite__shade" aria-hidden="true" />
      <div className="invite__inner">
        <Reveal as="p" className="s-label invite__label">{INVITE.label}</Reveal>
        <Words as="h2" text={title} className="t-l invite__title" center />
        <Reveal as="p" className="lead invite__text" delay={0.15}>{text}</Reveal>
        <Reveal className="invite__cta" delay={0.25}>
          <a className="pill pill--light" href={CTA.href}>{CTA.label} <Arrow /></a>
          <a className="link-u" href={`mailto:${EMAIL}`}>{INVITE.mail} {EMAIL} <Arrow /></a>
        </Reveal>
        <Reveal as="p" className="invite__advice" delay={0.3}>{INVITE.advice}</Reveal>
      </div>
    </section>
  );
}
