import { useEffect, useState } from 'react';
import { Arrow, Reveal } from '../ui/Primitives.jsx';
import { Sweep } from './Imagery.jsx';
import { EMAIL, LOOKS, NOTE } from '../../lib/content.js';
import { reduced, useInView } from '../../lib/hooks.js';

const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/* Break the Hydris note into words so they can light up one after another */
function noteWords() {
  let w = 0;
  return LOOKS.note.flatMap(([text, bold]) =>
    text.split(/(\s+)/).filter(Boolean).map((tok, i) => (/^\s+$/.test(tok)
      ? tok
      : <span key={`${w}-${i}`} className={bold ? 'ro__w ro__w--b' : 'ro__w'} style={{ '--w': w++ }}>{tok}</span>)));
}

/* The plant readout: rows settle in, the drifting value ticks, the note writes itself */
export function Readout() {
  const [ref, inView] = useInView({ threshold: 0.35, once: true });
  const [v, setV] = useState(3480);
  useEffect(() => {
    if (!inView || reduced) return undefined;
    const id = setInterval(() => setV((x) => x + Math.round(Math.random() * 14 - 3)), 2600);
    return () => clearInterval(id);
  }, [inView]);
  const [plant, shift, time] = LOOKS.head;
  return (
    <div ref={ref} className={`ro ${inView ? 'is-in' : ''}`}>
      <div className="ro__card" role="img" aria-label={LOOKS.alt}>
        <div className="ro__head" aria-hidden="true">
          <span className="ro__dot" />
          <span>{plant}</span><span className="ro__sep">·</span><span>{shift}</span>
          <span className="ro__time">{time}</span>
        </div>
        <div className="ro__rows" aria-hidden="true">
          {LOOKS.rows.map((r, i) => (
            <div className={`ro__row ${r.alert ? 'is-alert' : ''}`} style={{ '--i': i }} key={r.p}>
              <span className="ro__p">{r.p}</span>
              <span className="ro__v">
                {r.alert
                  ? <><svg className="ro__spark" viewBox="0 0 60 18" preserveAspectRatio="none"><path pathLength="1" d="M0 15 L9 14 L18 12.5 L27 10.5 L36 8 L46 5 L60 2" vectorEffect="non-scaling-stroke" /></svg><span key={v} className="ro__flash">{fmt(v)}</span></>
                  : r.v}
              </span>
              <span className="ro__s">{r.s}</span>
            </div>
          ))}
        </div>
        <div className="ro__note" aria-hidden="true">
          <p className="ro__lbl">Hydris</p>
          <p className="ro__txt">{noteWords()}</p>
        </div>
      </div>
      <p className="ro__cap">{LOOKS.caption}</p>
    </div>
  );
}

/* The intelligence stack. Layers rise from the systems at the base; a pulse climbs through them. */
export function LayerStack({ items }) {
  const [ref, inView] = useInView({ threshold: 0.25, once: true });
  const n = items.length;
  return (
    <div ref={ref} className={`lstack ${inView ? 'is-in' : ''}`}>
      {items.map((l, i) => (
        <div className={`lbar lbar--${l.kind}`} style={{ '--k': n - 1 - i }} key={l.name}>
          <span className="lbar__n">{String(n - i).padStart(2, '0')}</span>
          <span className="lbar__name">{l.name}</span>
          <span className="lbar__role">{l.role}</span>
        </div>
      ))}
    </div>
  );
}

/* Where we are today: the figure fills like a tank, a clarifier turns beside it, a wave runs underneath */
export function Proof({ big, unit, note, sweep }) {
  return (
    <div className={`proof grid ${sweep ? 'proof--photo' : ''}`}>
      <Reveal className="proof__main">
        <p className="proof__big" aria-label={big}><span>{big}</span></p>
        <p className="lead proof__unit">{unit}</p>
      </Reveal>
      {sweep && <div className="proof__sweep"><Sweep {...sweep} /></div>}
      <Reveal as="p" className="body mute proof__note" delay={0.2}>{note}</Reveal>
      <div className="proof__wave" aria-hidden="true" />
    </div>
  );
}

/* Three short outcomes with a count-in */
export function ResultStrip({ items }) {
  return (
    <Reveal className="result">
      <p className="s-label result__lbl">Result</p>
      <p className="result__row">
        {items.map((t, i) => (
          <span className="result__i" style={{ '--i': i }} key={t}>{t}{i < items.length - 1 && <i aria-hidden="true">·</i>}</span>
        ))}
      </p>
    </Reveal>
  );
}

/* Monthly note sign-up. There is no list provider yet, so it opens an e-mail to the team. */
export function Capture() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setMsg('Please enter a valid work e-mail address.'); return; }
    const subject = 'Subscribe me to the monthly note';
    const body = `Please add this address to the monthly note: ${email.trim()}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMsg(`Your e-mail app should now be open with the request ready to send. Nothing opened? Write to ${EMAIL}.`);
  };
  return (
    <section className="sec sec--tight capture">
      <div className="capture__grid grid">
        <div className="capture__text">
          <Reveal as="h2" className="t-s">{NOTE.title}</Reveal>
          <Reveal as="p" className="body mute capture__sub" delay={0.1}>{NOTE.text}</Reveal>
        </div>
        <Reveal as="form" className="capture__form" noValidate onSubmit={submit} delay={0.15}>
          <label htmlFor="cap-email" className="s-label">Work email</label>
          <div className="capture__row">
            <input id="cap-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@yourcompany.com"
              value={email} onChange={(e) => { setEmail(e.target.value); if (msg) setMsg(''); }} required />
            <button className="pill" type="submit">Subscribe <Arrow /></button>
          </div>
          <p className="capture__msg" role="status" aria-live="polite">{msg}</p>
        </Reveal>
      </div>
    </section>
  );
}
