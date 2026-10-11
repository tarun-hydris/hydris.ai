import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../reactbits/ScrollReveal/ScrollReveal.jsx';
import SpotlightCard from '../reactbits/SpotlightCard/SpotlightCard.jsx';
import { Accordion, Heading, Reveal } from '../ui/Primitives.jsx';
import Icon from '../ui/Icon.jsx';
import { EMAIL } from '../../lib/content.js';
import { useInView, useMotionOff } from '../../lib/hooks.js';

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
  const off = useMotionOff();
  const [on, setOn] = useState(off ? steps.length : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (off) { el.style.setProperty('--p', 1); setOn(steps.length); return undefined; }
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 78%', end: 'bottom 55%',
      onUpdate: (self) => {
        el.style.setProperty('--p', self.progress.toFixed(3));
        const n = self.progress > 0 ? Math.min(steps.length, Math.floor(self.progress * steps.length) + 1) : 0;
        setOn((v) => (v === n ? v : n));
      },
    });
    return () => st.kill();
  }, [steps.length, off]);
  return (
    <ol className="tl" ref={ref} style={{ '--p': off ? 1 : 0, '--n': steps.length }}>
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

/* Four plain promises, each ticked off as it arrives */
export function Assurances({ items }) {
  const [ref, inView] = useInView({ threshold: 0.3, once: true });
  return (
    <ul ref={ref} className={`assure grid ${inView ? 'is-in' : ''}`}>
      {items.map((c, i) => (
        <li className="assure__item" key={c.title} style={{ '--i': i }}>
          <svg className="assure__tick" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10.5" pathLength="1" />
            <path d="M7.4 12.4l3 3 6.2-6.6" pathLength="1" />
          </svg>
          <h3 className="assure__t">{c.title}</h3>
          <p className="assure__p">{c.text}</p>
        </li>
      ))}
    </ul>
  );
}
