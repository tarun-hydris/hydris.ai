import { useEffect, useId, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView, useMotionOff, useReady } from '../../lib/hooks.js';

/* Appear on scroll: a short rise and fade. CSS owns the motion, so Pause motion simply shows everything. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -8% 0px', once: true });
  const ready = useReady();
  return (
    <Tag ref={ref} className={`reveal ${inView && ready ? 'is-in' : ''} ${className}`} style={{ '--d': `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/* Mounts decorative (WebGL / canvas) children only while near the viewport and only while motion is on */
export function Visible({ children, rootMargin = '200px', className = '' }) {
  const [ref, inView] = useInView({ rootMargin });
  const off = useMotionOff();
  return <div ref={ref} className={`visible ${className}`}>{inView && !off ? children : null}</div>;
}

/* Headline reveal: every word rises out of its own mask. The words stay in the DOM as plain text. */
export function Words({ as: Tag = 'h1', text, className = '', delay = 0, center = false }) {
  const ready = useReady();
  const [ref, inView] = useInView({ once: true });
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`wm ${ready && inView ? 'is-in' : ''} ${className}`} style={center ? { textAlign: 'center' } : undefined}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="wm__w"><span className="wm__i" style={{ '--i': i, '--d': `${delay}s` }}>{w}</span></span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}

/* Section headings use the same word rise as page titles */
export function Heading({ as = 'h2', text, className = '', center = false }) {
  return <Words as={as} text={text} className={className} center={center} />;
}

/* Section header: (index) label on the left, title on the right */
export function SecHead({ index, label, title, text, tone }) {
  return (
    <header className={`sechead grid ${tone === 'dark' ? 'sechead--dark' : ''}`}>
      <Reveal as="p" className="s-label sechead__label">({index}){label ? ` ${label}` : ''}</Reveal>
      <div className="sechead__main">
        <Heading text={title} className="t-m" />
        {text && <Reveal as="p" className="sechead__text lead mute" delay={0.12}>{text}</Reveal>}
      </div>
    </header>
  );
}

/* Scroll-linked drift for decorative elements (GSAP ScrollTrigger scrub) */
export function Parallax({ children, amount = 60, className = '' }) {
  const ref = useRef(null);
  const off = useMotionOff();
  useEffect(() => {
    if (off || !ref.current) return undefined;
    const tween = gsap.fromTo(ref.current, { y: amount }, {
      y: -amount, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); tween.kill(); };
  }, [amount, off]);
  return <div ref={ref} className={className}>{children}</div>;
}

export { Arrow } from './Icon.jsx';

/* FAQ accordion. The button reports its state, the answer is a labelled region, and a collapsed
   answer is inert so its content cannot be focused or read while it is closed. */
export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  const uid = useId();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => clearTimeout(t);
  }, [open]);
  return (
    <div className="acc">
      {items.map(([q, a], i) => {
        const isOpen = open === i;
        const pid = `${uid}-p${i}`;
        const bid = `${uid}-b${i}`;
        return (
          <Reveal className={`acc__item ${isOpen ? 'is-open' : ''}`} key={q} delay={i * 0.04}>
            <h3 className="acc__h">
              <button id={bid} className="acc__btn" type="button" aria-expanded={isOpen} aria-controls={pid} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span className="acc__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="acc__q">{q}</span>
                <span className="acc__ic" aria-hidden="true" />
              </button>
            </h3>
            <div className="acc__panel" id={pid} role="region" aria-labelledby={bid} inert={!isOpen}>
              <div><p>{a}</p></div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
