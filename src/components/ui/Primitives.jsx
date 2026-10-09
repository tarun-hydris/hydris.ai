import { useEffect, useId, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlurText from '../reactbits/BlurText/BlurText.jsx';
import { reduced, useInView, useReady } from '../../lib/hooks.js';

/* Appear on scroll: soft blur + rise (the original site's entrance, made quieter) */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -8% 0px', once: true });
  const ready = useReady();
  return (
    <Tag ref={ref} className={`reveal ${inView && ready ? 'is-in' : ''} ${className}`} style={{ '--d': `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/* Mounts heavy (WebGL / canvas) children only while near the viewport */
export function Visible({ children, rootMargin = '200px', className = '' }) {
  const [ref, inView] = useInView({ rootMargin });
  return <div ref={ref} className={`visible ${className}`}>{inView ? children : null}</div>;
}

/* Word-by-word blur entrance for headings (React Bits BlurText) */
export function Heading({ as = 'h2', text, className = '', delay = 55, center = false }) {
  const ready = useReady();
  if (reduced) { const Tag = as; return <Tag className={className} style={center ? { textAlign: 'center' } : undefined}>{text}</Tag>; }
  return (
    <BlurText
      as={as}
      text={text}
      className={className}
      delay={delay}
      direction="bottom"
      stepDuration={0.4}
      startWhen={ready}
      animationFrom={{ filter: 'blur(12px)', opacity: 0, y: 28 }}
      animationTo={[{ filter: 'blur(4px)', opacity: 0.6, y: 6 }, { filter: 'blur(0px)', opacity: 1, y: 0 }]}
      style={center ? { justifyContent: 'center' } : undefined}
    />
  );
}

/* Headline reveal: every word slides up out of its own mask (used for page H1s) */
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

/* Section header: (index) label on the left, title on the right */
export function SecHead({ index, label, title, text, tone }) {
  return (
    <header className={`sechead grid ${tone === 'dark' ? 'sechead--dark' : ''}`}>
      <Reveal as="p" className="s-label sechead__label">({index}){label ? ` ${label}` : ''}</Reveal>
      <div className="sechead__main">
        <Heading text={title} className="t-m" />
        {text && <Reveal as="p" className="sechead__text lead mute" delay={0.15}>{text}</Reveal>}
      </div>
    </header>
  );
}

/* Scroll-linked drift for decorative elements (GSAP ScrollTrigger scrub) */
export function Parallax({ children, amount = 60, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reduced || !ref.current) return undefined;
    const tween = gsap.fromTo(ref.current, { y: amount }, {
      y: -amount, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); tween.kill(); };
  }, [amount]);
  return <div ref={ref} className={className}>{children}</div>;
}

export { Arrow } from './Icon.jsx';

/* FAQ accordion */
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
        return (
          <Reveal className={`acc__item ${isOpen ? 'is-open' : ''}`} key={q} delay={i * 0.05}>
            <h3 className="acc__h">
              <button className="acc__btn" type="button" aria-expanded={isOpen} aria-controls={pid} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span className="acc__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="acc__q">{q}</span>
                <span className="acc__ic" aria-hidden="true" />
              </button>
            </h3>
            <div className="acc__panel" id={pid} role="region">
              <div><p>{a}</p></div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
