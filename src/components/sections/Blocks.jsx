import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DotGrid from '../reactbits/DotGrid/DotGrid.jsx';
import Threads from '../reactbits/Threads/Threads.jsx';
import Magnet from '../reactbits/Magnet/Magnet.jsx';
import ScrollReveal from '../reactbits/ScrollReveal/ScrollReveal.jsx';
import ScrollVelocity from '../reactbits/ScrollVelocity/ScrollVelocity.jsx';
import { LogoLoop } from '../reactbits/LogoLoop/LogoLoop.jsx';
import SpotlightCard from '../reactbits/SpotlightCard/SpotlightCard.jsx';
import { WIDGETS } from '../widgets/Widgets.jsx';
import { Accordion, Arrow, Heading, Reveal, Visible, Words } from '../ui/Primitives.jsx';
import Icon from '../ui/Icon.jsx';
import { EMAIL, LOOP, START, SYSTEMS } from '../../lib/content.js';
import { reduced, useInView, useMedia } from '../../lib/hooks.js';
import { scrollToY } from '../../lib/scroll.js';

/* A quiet grey "drafting table" panel that hosts one live widget */
export function Panel({ name, on }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  const W = WIDGETS[name];
  const active = inView && (on === undefined ? true : on);
  return (
    <div ref={ref} className="panel">
      <span className="panel__grid" aria-hidden="true" />
      <W active={active} />
    </div>
  );
}

/* Interactive dot field used as a background in open space (React Bits DotGrid) */
export function Dots({ className = '' }) {
  if (reduced) return null;
  return (
    <div className={`dots ${className}`} aria-hidden="true">
      <Visible>
        <DotGrid dotSize={3} gap={26} baseColor="#dcdcdc" activeColor="#111111" proximity={140}
          shockRadius={220} shockStrength={4} resistance={750} returnDuration={1.5} />
      </Visible>
    </div>
  );
}

/* Process: pinned stepper on desktop, stacked on small screens */
export function Process({ steps }) {
  const desktop = useMedia('(min-width: 901px)');
  const trackRef = useRef(null);
  const listRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!desktop || !trackRef.current) return undefined;
    const st = ScrollTrigger.create({
      trigger: trackRef.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        if (listRef.current) listRef.current.style.setProperty('--p', self.progress.toFixed(4));
        setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.9999)));
      },
    });
    return () => st.kill();
  }, [desktop, steps.length]);

  const go = (i) => {
    const el = trackRef.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / steps.length));
  };

  if (!desktop) {
    return (
      <div className="process-m">
        {steps.map((s, i) => (
          <article className="process-m__step" key={s.key}>
            <Reveal as="p" className="s-label">{String(i + 1).padStart(2, '0')} · {s.key}</Reveal>
            <Heading as="h3" text={s.title} className="t-s" />
            <Reveal as="p" className="body mute">{s.text}</Reveal>
            <Reveal><Panel name={s.widget} /></Reveal>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="process__track" style={{ '--n': steps.length }} ref={trackRef}>
      <div className="process__sticky">
        <Dots />
        <div className="process__grid grid">
          <ol className="psteps" ref={listRef}>
            {steps.map((s, i) => (
              <li className={`pstep ${i === active ? 'is-active' : ''}`} key={s.key}>
                <button className="pstep__head" type="button" onClick={() => go(i)} aria-label={`${s.key}: ${s.title}`}>
                  <span className="pstep__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pstep__t">{s.key}</span>
                </button>
                <div className="pstep__body"><div><p className="pstep__lead">{s.title}</p><p>{s.text}</p></div></div>
              </li>
            ))}
          </ol>
          <div className="process__stage">
            {steps.map((s, i) => (
              <div className={`pstage ${i === active ? 'is-active' : ''}`} key={s.key}>
                <Panel name={s.widget} on={i === active} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Big marquee band that speeds up with scroll (React Bits ScrollVelocity) */
export function Velocity({ texts }) {
  return (
    <section className="velo" aria-hidden="true">
      <ScrollVelocity texts={texts} velocity={34} numCopies={4} damping={50} stiffness={400}
        className="velo__txt" parallaxClassName="velo__row" scrollerClassName="velo__scroller" />
    </section>
  );
}

/* The systems a plant already runs (React Bits LogoLoop) */
export function SystemsLoop() {
  const logos = SYSTEMS.map((n) => ({ node: <span className="stack__item"><i />{n}</span>, title: n }));
  return (
    <section className="stack" aria-label="The systems you already run">
      <div className="grid stack__head">
        <Reveal as="p" className="s-label stack__label">The systems you already run</Reveal>
        <Reveal as="p" className="lead stack__text" delay={0.1}>We do not replace them. We add the intelligence layer on top.</Reveal>
      </div>
      <LogoLoop logos={logos} speed={46} direction="left" logoHeight={64} gap={64} pauseOnHover fadeOut fadeOutColor="#ffffff" ariaLabel="The systems you already run" />
    </section>
  );
}

/* Icon cards (React Bits SpotlightCard). Icons draw themselves on entry. */
export function IconCards({ items, cols = 3, variant = '' }) {
  return (
    <div className={`icards ${variant}`} style={{ '--cols': cols }}>
      {items.map((c, i) => (
        <Reveal className="icards__cell" key={c.title} delay={(i % cols) * 0.08}>
          <SpotlightCard className="icard" spotlightColor="rgba(0, 0, 0, 0.08)">
            <span className="icard__n">{String(i + 1).padStart(2, '0')}</span>
            <Icon name={c.icon} className="icard__ico icon--draw" />
            <h3 className="icard__t">{c.title}</h3>
            <p className="icard__p">{c.text}</p>
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
  );
}

/* Definition card: the big statement scrubs in word by word */
export function Definition({ term, d1, d2 }) {
  return (
    <div className="defn">
      <Reveal as="p" className="s-label defn__term">{term}</Reveal>
      <ScrollReveal as="p" textClassName="defn__d1" baseOpacity={0.14} enableBlur blurStrength={5} baseRotation={1.2}>{d1}</ScrollReveal>
      <div className="defn__d2 grid">
        {d2.map((t, i) => <Reveal as="p" className="lead defn__p" key={i} delay={0.1 + i * 0.12}>{t}</Reveal>)}
      </div>
    </div>
  );
}

/* "It is not" grid: the name is struck through as it enters */
export function Nots({ items }) {
  return (
    <div className="nots">
      {items.map((n, i) => (
        <Reveal className="not" key={n.x} delay={i * 0.09}>
          <p className="s-label not__lbl">It is not</p>
          <p className="not__x"><span>{n.x}</span></p>
          <p className="body mute not__y">{n.y}</p>
        </Reveal>
      ))}
    </div>
  );
}

/* Ruled rows. A hairline draws across each row as it enters. */
export function RowList({ rows, variant = '' }) {
  return (
    <div className={`rows ${variant}`}>
      {rows.map((r, i) => (
        <Reveal className="lrow hl" key={r.title || r.k} delay={(i % 5) * 0.04}>
          <span className="lrow__a">{r.icon ? <Icon name={r.icon} className="lrow__ico icon--draw" /> : r.a}</span>
          {r.title && (
            <div className="lrow__t">
              <h3 className="t-row">{r.title}</h3>
              {r.role && <p className="lrow__role">{r.role}</p>}
            </div>
          )}
          <div className="lrow__b">
            {r.where && <p className="lrow__where">{r.where}</p>}
            <p className="body">{r.text}</p>
          </div>
          {r.action && <div className="lrow__act">{r.action}</div>}
        </Reveal>
      ))}
    </div>
  );
}

/* Implementation timeline: the line fills as you scroll, steps light up in turn */
export function Timeline({ steps }) {
  const ref = useRef(null);
  const [on, setOn] = useState(reduced ? steps.length : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 78%', end: 'bottom 55%',
      onUpdate: (self) => {
        el.style.setProperty('--p', self.progress.toFixed(3));
        const n = self.progress > 0 ? Math.min(steps.length, Math.floor(self.progress * steps.length) + 1) : 0;
        setOn((v) => (v === n ? v : n));
      },
    });
    return () => st.kill();
  }, [steps.length]);
  return (
    <ol className="tl" ref={ref} style={{ '--p': reduced ? 1 : 0, '--n': steps.length }}>
      <span className="tl__line" aria-hidden="true"><i /></span>
      {steps.map((s, i) => (
        <li className={`tl__step ${i < on ? 'is-on' : ''}`} key={s.title}>
          <span className="tl__dot"><b>{i + 1}</b></span>
          <p className="s-label tl__when">{s.when}</p>
          <h3 className="t-row">{s.title}</h3>
          <p className="body mute">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* Closing statement: lead-in in grey, the point in black */
export function Oneline({ parts }) {
  return (
    <Reveal className="oneline">
      <p><span>{parts[0]}</span><b>{parts[1]}</b></p>
    </Reveal>
  );
}

/* Three products on one platform, with the learning loop drawn underneath */
export function Products({ items }) {
  return (
    <>
      <div className="prods">
        {items.map((p, i) => (
          <Reveal className="prods__cell" key={p.name} delay={i * 0.1}>
            <SpotlightCard className="prodcard" spotlightColor="rgba(0, 0, 0, 0.08)">
              <span className="prodcard__n">{String(i + 1).padStart(2, '0')}</span>
              <Icon name={p.icon} className="prodcard__ico icon--draw" />
              <h3 className="t-s prodcard__t">{p.name}</h3>
              <p className="s-label prodcard__role">{p.role}</p>
              <p className="body mute">{p.text}</p>
              <ul className="prodcard__verbs">{p.verbs.map((v) => <li key={v}>{v}</li>)}</ul>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
      <Reveal className="loop" delay={0.1}>
        <svg className="loop__svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M83 0 V22 Q83 34 71 34 H29 Q17 34 17 22 V6" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="loop__tip" aria-hidden="true"><Arrow dir="up" /></span>
        <p className="loop__txt"><span className="s-label">{LOOP.label}</span>{LOOP.text}</p>
      </Reveal>
      <Oneline parts={LOOP.one} />
    </>
  );
}

/* Pull quote */
export function Quote({ text, cite }) {
  return (
    <Reveal as="figure" className="quote">
      <blockquote className="quote__t">{text}</blockquote>
      <figcaption className="s-label quote__c">{cite}</figcaption>
    </Reveal>
  );
}

/* FAQ with an inline contact line */
export function Faq({ index, items }) {
  return (
    <section className="sec faq" id="faq">
      <div className="grid">
        <div className="faq__aside">
          <Reveal as="p" className="s-label">({index}) Questions</Reveal>
          <Heading text="The things people ask us first." className="t-m" />
          <Reveal as="p" className="body mute faq__note" delay={0.1}>
            Something not here? <a className="link-u" href={`mailto:${EMAIL}`}>Write to us</a> and a person will answer.
          </Reveal>
        </div>
        <div className="faq__list"><Accordion items={items} /></div>
      </div>
    </section>
  );
}

/* Dark closing band (React Bits Threads + Magnet) */
export function Cta({ short = false }) {
  return (
    <section className="cta" aria-label={START.eyebrow}>
      <div className="cta__bg" aria-hidden="true">{!reduced && <Visible><Threads color={[1, 1, 1]} amplitude={1.1} distance={0.05} enableMouseInteraction /></Visible>}</div>
      <div className="cta__inner">
        <Reveal as="p" className="s-label cta__label">{START.eyebrow}</Reveal>
        <Words as="h2" text={START.title} className="t-m cta__title" center />
        <Reveal as="p" className="lead cta__text" delay={0.2}>{short ? START.textShort : START.text}</Reveal>
        <Reveal className="cta__actions" delay={0.3}>
          <Magnet padding={90} magnetStrength={3}>
            <a className="round" href="/contact/"><span>Talk<br />to us</span></a>
          </Magnet>
          <a className="link-u cta__mail" href={`mailto:${EMAIL}`}>{EMAIL} <Arrow /></a>
        </Reveal>
      </div>
    </section>
  );
}
