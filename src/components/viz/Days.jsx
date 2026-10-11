import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mark } from '../ui/Brand.jsx';
import { reduced, useMotionOff } from '../../lib/hooks.js';
import '../../styles/viz/days.css';

/* Platform, "the idea underneath": the days between the cause and the alarm, drawn as a heat strip.
   A cursor walks from D-5 to D0 and paints each row from the day its signal begins, the alarm lights
   only at D0, then the chain is traced back to its origin and the lead time is bracketed.
   Illustrative and decorative (aria-hidden): the copy beside it carries the meaning.

   Motion: one GSAP timeline (transform, opacity, clip-path, stroke-dashoffset only), no React state
   while it runs. It plays while `active`, pauses otherwise, loops with a quiet reset, and is not built
   at all under reduced motion, where the CSS default is the complete, final picture. */

const DAYS = ['D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'D0'];
const ROWS = [
  { name: 'Upstream', start: 0 },
  { name: 'Biology', start: 2 },
  { name: 'Equipment', start: 3 },
  { name: 'Alarm', start: 5, alarm: true },
];
const N = DAYS.length;
const LAST = N - 1;

/* The signal builds towards the alarm: a slate ramp per row, from its first day to D0 */
const heat = (start, c) => (0.3 + 0.62 * ((c - start + 1) / (N - start))).toFixed(2);

/* Choreography, in seconds */
const STEP = 0.8; // one day under the cursor
const T0 = 0.5; // the sweep begins
const TE = T0 + N * STEP; // the cursor reaches the end of D0
const TR = TE + 2.45 + 3.4; // annotations settle, then hold, then reset

export function Days({ active }) {
  const motionOff = useMotionOff(); // re-render when Pause motion or the system setting changes
  const root = useRef(null);
  const tl = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (reduced || !el) return undefined;
    const $ = (s) => el.querySelector(s);
    const $$ = (s) => Array.from(el.querySelectorAll(s));
    const days = $$('.vz-days__d');
    const names = $$('.vz-days__n');
    const now = $('.vz-days__nowv');
    const fills = $$('.vz-days__f');

    /* Axis, row labels and the readout follow the cursor (class toggles, CSS does the easing) */
    const mark = (c) => {
      days.forEach((d, i) => {
        d.classList.toggle('is-on', i <= c);
        d.classList.toggle('is-alarm', c === LAST && i === LAST);
      });
      names.forEach((n, r) => n.classList.toggle('is-on', ROWS[r].start <= c));
      if (c >= 0) now.textContent = DAYS[c];
      now.classList.toggle('is-alarm', c === LAST);
    };
    mark(-1);

    const ctx = gsap.context(() => {
      const cur = $('.vz-days__cur');
      const fx = $('.vz-days__fx');
      const span = $('.vz-days__span');
      const pin = $('.vz-days__pin');
      const msg = $('.vz-days__msgt');
      const t = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'none' } });

      // The cursor fades in on D-5 and sweeps to the end of D0 at a constant pace
      t.fromTo(cur, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, T0 - 0.3);
      t.fromTo(cur, { xPercent: 0 }, { xPercent: 100, duration: N * STEP }, T0);

      // Each lit cell grows from the left while the cursor crosses it (cells are inset 7% per side)
      fills.forEach((f) => {
        const c = Number(f.dataset.c);
        t.fromTo(f, { scaleX: 0 }, { scaleX: 1, duration: STEP * 0.86 }, T0 + c * STEP + STEP * 0.07);
      });

      // Day readout ticks over as each day begins
      for (let c = 0; c < N; c++) {
        const at = T0 + c * STEP;
        t.call(mark, [c], at);
        t.fromTo(now, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power2.out', immediateRender: c === 0 }, at);
      }

      // D0: the alarm is live; the cursor steps back so the trace reads first
      t.fromTo('.vz-days__ping', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, TE - 0.05);
      t.to(cur, { opacity: 0.28, duration: 0.5, ease: 'power1.out' }, TE + 0.1);

      // Trace back: origin on Upstream at D-5, down the column, along to the alarm
      t.fromTo('.vz-days__org', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' }, TE + 0.25);
      t.fromTo('.vz-days__lv', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'power2.inOut' }, TE + 0.4);
      t.fromTo('.vz-days__lh', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut' }, TE + 0.8);
      t.fromTo('.vz-days__tip', { opacity: 0, x: -4 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, TE + 1.5);

      // The lead time: label first, then the bracket opens out to D-5 and D-1, then the message
      t.fromTo('.vz-days__len', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, TE + 1.2);
      t.fromTo('.vz-days__brace path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, TE + 1.3);
      t.fromTo(pin, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }, TE + 1.75);
      t.fromTo(msg, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, TE + 1.85);

      // Reset: everything that moved fades together, the labels return to grey, a short rest
      t.to([cur, now, fx, span, pin, msg, ...fills], { opacity: 0, duration: 0.5, ease: 'power1.inOut' }, TR);
      t.call(mark, [-1], TR + 0.55);
      t.to({}, { duration: 0.35 }, TR + 0.55);

      tl.current = t;
    }, el);

    return () => {
      ctx.revert();
      tl.current = null;
    };
  }, [motionOff]);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (active) t.play();
    else t.pause();
  }, [active, motionOff]);

  const s = reduced; // static: the final, fully annotated state
  return (
    <div ref={root} className={`vz-days ${s ? 'is-static' : ''} ${active && !s ? 'is-on' : ''}`} aria-hidden="true">
      <div className="vz-days__head">
        <b className="vz-days__title">One cause, five days</b>
        <span className="vz-days__meta">Illustrative</span>
      </div>

      <div className="vz-days__bar">
        <span className="vz-days__key"><i className="vz-days__ramp"><span /><span /><span /></i>Signal</span>
        <span className="vz-days__key"><i className="vz-days__sw" />Alarm</span>
        <span className="vz-days__now">
          <i className="vz-days__live" />
          Now
          <span className="vz-days__nowm"><b className={`vz-days__nowv ${s ? 'is-alarm' : ''}`}>D0</b></span>
        </span>
      </div>

      <div className="vz-days__plot">
        <div className="vz-days__axis">
          <span />
          <div className="vz-days__ticks">
            {DAYS.map((d, i) => (
              <span className={`vz-days__d ${s ? 'is-on' : ''} ${s && i === LAST ? 'is-alarm' : ''}`} key={d}>{d}</span>
            ))}
          </div>
        </div>

        {ROWS.map((r) => (
          <div className={`vz-days__row ${r.alarm ? 'is-alarm' : ''}`} key={r.name}>
            <span className={`vz-days__n ${s ? 'is-on' : ''}`}>{r.name}</span>
            <div className="vz-days__cells">
              {DAYS.map((d, c) => (
                <span className="vz-days__c" key={d}>
                  {c >= r.start && (
                    <i className="vz-days__f" data-c={c} style={r.alarm ? undefined : { '--a': heat(r.start, c) }} />
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div className="vz-days__over">
          <span className="vz-days__grid" />
          <div className="vz-days__fx">
            <span className="vz-days__lv" />
            <span className="vz-days__lh" />
            <span className="vz-days__tip"><i /></span>
            <span className="vz-days__org" />
            <span className="vz-days__ping"><i /></span>
          </div>
          <div className="vz-days__scan"><span className="vz-days__cur"><i /></span></div>
        </div>
      </div>

      <div className="vz-days__span">
        <svg className="vz-days__brace" viewBox="0 0 100 10" preserveAspectRatio="none">
          <path pathLength="1" vectorEffect="non-scaling-stroke" d="M34 7.5H0.5V1" />
          <path pathLength="1" vectorEffect="non-scaling-stroke" d="M66 7.5H99.5V1" />
        </svg>
        <span className="vz-days__len">5 days</span>
      </div>

      <p className="vz-days__msg">
        <span className="vz-days__pin"><Mark className="vz-days__pinmark" /></span>
        <span className="vz-days__msgt"><b>Hydris flags it here</b> and your team gets those days back.</span>
      </p>
    </div>
  );
}

export default Days;
