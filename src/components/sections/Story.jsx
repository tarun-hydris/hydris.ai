import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon, { Arrow } from '../ui/Icon.jsx';
import { FilmButton } from '../ui/Film.jsx';
import Infographic from '../ui/Infographic.jsx';
import { Reveal, Words } from '../ui/Primitives.jsx';
import { CTA, STORY } from '../../lib/content.js';
import { useMotionOff } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------------------------------------
   The Home story after the opening, in the order of the Hydris platform film. Each chapter answers the
   question the one before it raises. Motion is quiet and tied to meaning: scattered records settle into
   one picture, a handover moves from one shift to the next. With motion paused everything is shown in
   its final, readable state.
   ------------------------------------------------------------------------------------------------ */

/* A still from the platform film (public/film/<name>-<w>.webp) */
const STILLS = {
  lite: [1280, 668], pulse: [1280, 720], field: [1280, 720], handover: [1280, 536],
  stewardship: [1280, 536], portfolio: [1280, 536], river: [1280, 536], poster: [1280, 720],
};
export function Still({ name, alt = '', sizes = '(min-width: 901px) 55vw, 100vw', className = '', priority = false }) {
  const [W, H] = STILLS[name];
  return (
    <img
      className={`still ${className}`}
      src={`/film/${name}-1280.webp`}
      srcSet={`/film/${name}-720.webp 720w, /film/${name}-1280.webp 1280w`}
      sizes={sizes}
      width={W}
      height={H}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
    />
  );
}

const Label = ({ index, children, className = '' }) => (
  <Reveal as="p" className={`s-label story__label ${className}`}>{index ? `(${index}) ` : ''}{children}</Reveal>
);

/* ------------------------------------------------------------------------------------------------
   Act II. The problem is not only water. It is knowledge.
   Six records start scattered and settle into one ordered picture as the section comes into view.
   ------------------------------------------------------------------------------------------------ */
const SCATTER = [
  { x: -46, y: -38, r: -7 }, { x: 64, y: -22, r: 6 }, { x: -70, y: 10, r: 4 },
  { x: 52, y: 26, r: -5 }, { x: -28, y: 48, r: 8 }, { x: 74, y: 58, r: -3 },
];
const FRAG_ICONS = ['stack', 'flask', 'book', 'grid', 'doc', 'eye'];

export function Knowledge({ index = '02' }) {
  const K = STORY.knowledge;
  const off = useMotionOff();
  const box = useRef(null);

  useEffect(() => {
    if (off || !box.current) return undefined;
    const el = box.current;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.frag__item');
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'center 48%', scrub: 0.6 },
      });
      items.forEach((it, i) => {
        const s = SCATTER[i % SCATTER.length];
        tl.fromTo(it,
          { xPercent: s.x, yPercent: s.y * 2.2, rotation: s.r, opacity: 0.55 },
          { xPercent: 0, yPercent: 0, rotation: 0, opacity: 1, duration: 1, ease: 'power2.out' }, i * 0.06);
      });
      tl.fromTo('.frag__rail', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power1.inOut' }, 0.5)
        .fromTo('.frag__together', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, 0.85);
    }, el);
    return () => ctx.revert();
  }, [off]);

  return (
    <section id="knowledge" className="know sec" aria-label={K.label}>
      <div className="know__grid grid">
        <div className="know__text">
          <Label index={index}>{K.label}</Label>
          <Words as="h2" text={K.title} className="t-l know__title" />
          <div className="know__qs">
            {K.questions.map((q, i) => <Reveal as="p" key={q} className="t-m know__q" delay={0.1 + i * 0.12}>{q}</Reveal>)}
          </div>
          <Reveal as="p" className="lead know__lead" delay={0.2}>{K.lead}</Reveal>
        </div>

        <div className="frag" ref={box} aria-label={`${K.fragments.join(', ')}: ${K.together}`} role="img">
          <span className="frag__rail" aria-hidden="true" />
          <ul className="frag__list" aria-hidden="true">
            {K.fragments.map((f, i) => (
              <li className="frag__item" key={f}>
                <Icon name={FRAG_ICONS[i]} className="frag__ico" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="frag__together" aria-hidden="true"><i />{K.together}</p>
        </div>
      </div>

      <div className="know__row grid">
        <ol className="know__realities">
          {K.realities.map((r, i) => (
            <Reveal as="li" key={r} className="know__real hl" delay={i * 0.07}>
              <span className="know__n">{String(i + 1).padStart(2, '0')}</span>
              <p>{r}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="know__stat" delay={0.15}>
          <p className="know__statn">{K.stat.n}</p>
          <p className="body">{K.stat.text}</p>
          <p className="s-label mute">{K.stat.source}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Act III. Hydris: scientific principles, operational data and human reasoning, in one place. See, understand, act.
   ------------------------------------------------------------------------------------------------ */
export function Hydris({ index = '03' }) {
  const H = STORY.hydris;
  return (
    <section id="hydris" className="hyd sec" aria-label={H.label}>
      <div className="hyd__head grid">
        <Label index={index}>{H.label}</Label>
        <Words as="h2" text={H.title} className="t-l hyd__title" />
        <Reveal as="p" className="lead hyd__lead" delay={0.15}>{H.lead}</Reveal>
        <Reveal className="hyd__fig" delay={0.1}><Infographic name="venn-hydris" /></Reveal>
      </div>
      <ol className="hyd__steps grid">
        {H.steps.map((s, i) => (
          <Reveal as="li" key={s.verb} className="hyd__step" delay={0.1 + i * 0.12}>
            <a href={s.href} className="hyd__link">
              <span className="hyd__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="t-m hyd__verb">{s.verb}</span>
              <span className="lead hyd__what">{s.what}</span>
              <span className="s-label hyd__prod">{s.product} <Arrow dir="down" /></span>
            </a>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Act IV. The three products. One row each: the screen from the film, what it is for, what it gives
   the team, and a way into the live demo.
   ------------------------------------------------------------------------------------------------ */
function ProductRow({ p, i, caption, tryLabel, moreLabel }) {
  return (
    <article id={p.key} className={`prow grid ${i % 2 ? 'prow--flip' : ''}`} aria-labelledby={`prow-${p.key}`}>
      <Reveal className="prow__media">
        <div className="prow__frame prow__frame--ig">
          <Infographic name={p.ig} bare />
        </div>
        <p className="s-label prow__cap">{caption}</p>
      </Reveal>
      <div className="prow__copy">
        <Reveal as="p" className="s-label prow__verb"><span>{String(i + 1).padStart(2, '0')}</span>{p.verb}</Reveal>
        <Reveal as="h3" className="prow__name" id={`prow-${p.key}`} delay={0.05}>{p.name}</Reveal>
        <Reveal as="p" className="t-s prow__title" delay={0.1}>{p.title}</Reveal>
        <Reveal as="p" className="body prow__text" delay={0.15}>{p.text}</Reveal>
        <Reveal as="ul" className="prow__points" delay={0.2}>
          {p.points.map((t) => <li key={t}><Icon name="check" />{t}</li>)}
        </Reveal>
        <Reveal as="p" className="prow__note" delay={0.25}>{p.note}</Reveal>
        <Reveal className="prow__acts" delay={0.3}>
          <a className="pill" href={`/demo/#${p.key}`}>{tryLabel}: {p.name.replace('Hydris ', '')} <Arrow /></a>
          <a className="link-u" href={`/platform/#${p.key}`}>{moreLabel}</a>
        </Reveal>
      </div>
    </article>
  );
}

export function Products({ index = '04' }) {
  const P = STORY.products;
  return (
    <section id="products" className="prods sec" aria-label={P.label}>
      <div className="prods__head grid">
        <Label index={index}>{P.label}</Label>
        <Words as="h2" text={P.title} className="t-l prods__title" />
      </div>
      <div className="prods__rows">
        {P.items.map((p, i) => (
          <ProductRow key={p.key} p={p} i={i} caption={P.caption} tryLabel={P.tryLabel} moreLabel={P.moreLabel} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Act V. Knowledge that remains. A handover told as five steps; a marker carries the record from one
   shift to the next as the section is read.
   ------------------------------------------------------------------------------------------------ */
export function Memory({ index = '05' }) {
  const M = STORY.memory;
  const off = useMotionOff();
  const seq = useRef(null);

  useEffect(() => {
    const el = seq.current;
    if (!el) return undefined;
    const steps = [...el.querySelectorAll('.mem__step')];
    const n = steps.length;
    const light = (k) => steps.forEach((s, i) => s.classList.toggle('is-on', i < k));
    if (off) { el.style.setProperty('--p', '1'); light(n); return undefined; }
    let last = -1;
    const update = (p) => {
      el.style.setProperty('--p', p.toFixed(4));
      // A step lights as the line reaches its dot (the dots sit at the start of each column)
      const k = Math.min(n, Math.floor(p * n) + 1);
      if (k !== last) { last = k; light(p <= 0.001 ? 0 : k); }
    };
    update(0);
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 80%', end: 'bottom 55%',
      onUpdate: (self) => update(self.progress),
      onRefresh: (self) => update(self.progress),
    });
    return () => st.kill();
  }, [off, M.steps.length]);

  return (
    <section id="memory" className="mem sec" aria-label={M.label}>
      <div className="mem__grid grid">
        <div className="mem__text">
          <Label index={index}>{M.label}</Label>
          <Words as="h2" text={M.title} className="t-l mem__title" />
          <Reveal as="p" className="lead mem__sub" delay={0.12}>{M.sub}</Reveal>
          <Reveal as="p" className="body mute mem__body" delay={0.2}>{M.text}</Reveal>
        </div>
        <Reveal className="mem__media" delay={0.1}>
          <div className="mem__frame"><Infographic name="shift-memory" bare /></div>
        </Reveal>
      </div>

      <div className="mem__seqwrap grid">
        <ol className="mem__seq" ref={seq} style={{ '--n': M.steps.length }}>
          <span className="mem__line" aria-hidden="true"><i /></span>
          {M.steps.map((s, i) => (
            <li className="mem__step" key={s.k} style={{ '--i': i }}>
              <span className="mem__dot" aria-hidden="true" />
              <p className="s-label mem__k"><span>{String(i + 1).padStart(2, '0')}</span>{s.k}</p>
              <p className="mem__v">{s.v}</p>
            </li>
          ))}
        </ol>
        <p className="s-label mute mem__cap">{M.caption}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Act VI. Beyond the plant: Stewardship and Portfolio, presented as solution areas.
   ------------------------------------------------------------------------------------------------ */
export function Beyond({ index = '06' }) {
  const B = STORY.beyond;
  return (
    <section id="beyond" className="beyond sec" aria-label={B.label}>
      <div className="beyond__head grid">
        <Label index={index}>{B.label}</Label>
        <Words as="h2" text={B.title} className="t-l beyond__title" />
        <Reveal as="p" className="lead beyond__lead" delay={0.12}>{B.lead}</Reveal>
      </div>
      <div className="beyond__cards grid">
        {B.items.map((c, i) => (
          <Reveal as="article" key={c.name} className="bcard" delay={i * 0.12}>
            <div className="bcard__frame"><Infographic name={c.ig} bare /></div>
            <h3 className="t-s bcard__name">{c.name}</h3>
            <p className="body bcard__text">{c.text}</p>
            <ul className="bcard__points">{c.points.map((t) => <li key={t}>{t}</li>)}</ul>
          </Reveal>
        ))}
      </div>
      <div className="grid"><Reveal as="p" className="body mute beyond__note">{B.note}</Reveal></div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
   Act VII. The purpose. From the plant to the watershed, and the people it is for.
   ------------------------------------------------------------------------------------------------ */
export function Close() {
  const C = STORY.close;
  return (
    <section className="close close--light" data-tone="light" aria-label={C.label}>
      <div className="close__bg" aria-hidden="true"><Infographic name="every-drop" /></div>
      <div className="close__shade" aria-hidden="true" />
      <div className="close__inner grid">
        <Reveal as="p" className="s-label close__label">{C.label}</Reveal>
        <Words as="h2" text={C.title} className="t-l close__title" />
        <Reveal as="p" className="lead close__text" delay={0.15}>{C.text}</Reveal>
        <Reveal className="close__cta" delay={0.25}>
          <a className="pill pill--light" href={CTA.href}>{CTA.label} <Arrow /></a>
          <a className="link-u" href={CTA.demoHref}>{CTA.demo} <Arrow /></a>
          <FilmButton className="filmbtn filmbtn--light">{CTA.film}</FilmButton>
        </Reveal>
      </div>
    </section>
  );
}
