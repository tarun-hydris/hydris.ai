import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { reduced, sleep, useLoop, useMotionOff } from '../../lib/hooks.js';
import '../../styles/viz/reason.css';

/* 02 Understand: the same pH reading against two ideas of normal.
   A textbook allows a wide range; this plant runs in a narrow band. The reading glides
   from 7.1 (inside the plant band) to 7.6 (still fine in a textbook, unusual here).
   The pin, the figure and the trail are driven by one spring in requestAnimationFrame,
   so the number always matches where the pin is. Decorative (aria-hidden). */

const MIN = 5;
const MAX = 9;
const pct = (v) => ((v - MIN) / (MAX - MIN)) * 100;

const NORMAL = 7.1;
const ODD = 7.6;
const BAND = [6.9, 7.3]; // this plant's normal band, a visual parameter
const TEXTBOOK = { mu: 7.5, sd: 0.62, peak: 0.42 };
const PLANT = { mu: 7.1, sd: 0.11, peak: 0.8 };
const CHIPS = ['Plant layout', "This week's product", 'Operating rules'];
const MAJOR = [5, 6, 7, 8, 9];
const MINOR = [5.5, 6.5, 7.5, 8.5];

/* Density curves in a 400 x 100 box, stretched to the plot with preserveAspectRatio="none" */
const VW = 400;
const VH = 100;
const density = ({ mu, sd, peak }, x) => peak * Math.exp(-0.5 * ((x - mu) / sd) ** 2);
function curve(d) {
  const n = 240;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = MIN + (i / n) * (MAX - MIN);
    pts.push(`${((pct(x) / 100) * VW).toFixed(2)},${(VH - density(d, x) * VH).toFixed(2)}`);
  }
  const line = `M${pts.join('L')}`;
  return { line, area: `${line}L${VW},${VH}L0,${VH}Z` };
}
const TB = curve(TEXTBOOK);
const PL = curve(PLANT);

/* Damped spring (about 4% overshoot, settled in ~1.15 s): calm, never bouncy */
const ZETA = 0.72;
const OMEGA = 9.6;
const WD = OMEGA * Math.sqrt(1 - ZETA * ZETA);
const SETTLE = 1150;
const spring = (t) => 1 - Math.exp(-ZETA * OMEGA * t) * (Math.cos(WD * t) + ((ZETA * OMEGA) / WD) * Math.sin(WD * t));

export function Context({ active }) {
  useMotionOff(); // re-render when Pause motion or the system setting changes
  const gid = `vzctx${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const start = reduced ? ODD : NORMAL;
  const [odd, setOdd] = useState(start > BAND[1]);
  const [chips, setChips] = useState(reduced ? CHIPS.length : 0);
  const [drawn, setDrawn] = useState(reduced);

  const vRef = useRef(start);
  const outRef = useRef(start > BAND[1]);
  const rafRef = useRef(0);
  const numRef = useRef(null);
  const pinRef = useRef(null);
  const trailRef = useRef(null);

  /* Paint one value: figure, pin and trail together. React state only changes when the
     pin crosses the band edge, so this stays at frame rate without re-rendering. */
  const paint = (v) => {
    vRef.current = v;
    const n = numRef.current;
    if (n) {
      const s = v.toFixed(1);
      if (n.textContent !== s) n.textContent = s;
    }
    if (pinRef.current) pinRef.current.style.transform = `translate3d(${pct(v).toFixed(3)}%, 0, 0)`;
    if (trailRef.current) trailRef.current.style.transform = `scaleX(${Math.max(0, (v - NORMAL) / (ODD - NORMAL)).toFixed(4)})`;
    const out = v > BAND[1];
    if (out !== outRef.current) {
      outRef.current = out;
      setOdd(out);
    }
  };

  const glide = (to, alive) => new Promise((resolve) => {
    const from = vRef.current;
    if (Math.abs(to - from) < 0.0005) { resolve(); return; }
    const t0 = performance.now();
    const tick = (now) => {
      if (!alive()) { resolve(); return; }
      const t = (now - t0) / 1000;
      const done = t * 1000 >= SETTLE;
      paint(done ? to : from + (to - from) * spring(t));
      if (done) resolve();
      else rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  });

  useLayoutEffect(() => {
    paint(vRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /* The curves draw once, the first time the widget is shown */
  useEffect(() => {
    if (active && !drawn) setDrawn(true);
  }, [active, drawn]);

  useLoop(active, async (alive) => {
    if (vRef.current !== NORMAL) {
      setChips(0);
      await glide(NORMAL, alive);
      if (!alive()) return;
    }
    setChips(0);
    await sleep(800);
    if (!alive()) return;
    for (let i = 1; i <= CHIPS.length; i++) {
      setChips(i);
      await sleep(420);
      if (!alive()) return;
    }
    await sleep(420);
    if (!alive()) return;
    await glide(ODD, alive);
    if (!alive()) return;
    await sleep(2900);
    if (!alive()) return;
    await glide(NORMAL, alive);
    if (!alive()) return;
    setChips(0);
    await sleep(1500);
  });

  return (
    <div className={`vz-rsn vz-ctx ${active ? 'is-active' : ''} ${drawn ? 'is-drawn' : ''} ${odd ? 'is-odd' : ''}`} aria-hidden="true">
      <div className="vz-rsn__head">
        <b className="vz-rsn__title">pH reading</b>
        <span className="vz-rsn__meta"><i className="vz-rsn__live" />Plant 01</span>
      </div>

      <div className="vz-ctx__body">
        <div className="vz-ctx__read">
          <p className="vz-ctx__val"><span className="vz-ctx__num" ref={numRef} /><small>pH</small></p>
          <p className={`vz-swap vz-ctx__status ${odd ? 'is-b' : ''}`}>
            <span className="vz-ctx__st vz-ctx__st--ok"><i />Normal for this plant</span>
            <span className="vz-ctx__st vz-ctx__st--odd"><i />Unusual for this plant</span>
          </p>
        </div>

        <div className="vz-ctx__chart">
          <div className="vz-ctx__plot">
            <span className="vz-ctx__band" style={{ left: `${pct(BAND[0])}%`, width: `${pct(BAND[1]) - pct(BAND[0])}%` }} />
            <svg className="vz-ctx__svg vz-ctx__svg--tb" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
              <path className="vz-ctx__a vz-ctx__a--tb" d={TB.area} />
              <path className="vz-ctx__l vz-ctx__l--tb" d={TB.line} vectorEffect="non-scaling-stroke" />
            </svg>
            <svg className="vz-ctx__svg vz-ctx__svg--pl" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2a4148" stopOpacity="0.24" />
                  <stop offset="1" stopColor="#2a4148" stopOpacity="0.03" />
                </linearGradient>
              </defs>
              <path className="vz-ctx__a" d={PL.area} fill={`url(#${gid})`} />
              <path className="vz-ctx__l vz-ctx__l--pl" d={PL.line} vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="vz-ctx__tag vz-ctx__tag--pl" style={{ left: `${pct(BAND[0])}%` }}>In this plant</span>
            <span className="vz-ctx__tag vz-ctx__tag--tb">In a textbook</span>
            <span className="vz-ctx__ghost" style={{ left: `${pct(NORMAL)}%` }} />
            <span className="vz-ctx__trail" style={{ left: `${pct(NORMAL)}%`, width: `${pct(ODD) - pct(NORMAL)}%` }}><i ref={trailRef} /></span>
            <span className="vz-ctx__pinw" ref={pinRef}><span className="vz-ctx__pin"><b>Now</b><i /></span></span>
          </div>
          <div className="vz-ctx__axis">
            {MINOR.map((t) => <span className="vz-ctx__tick" key={t} style={{ left: `${pct(t)}%` }} />)}
            {MAJOR.map((t) => (
              <span className="vz-ctx__tick vz-ctx__tick--maj" key={t} style={{ left: `${pct(t)}%` }}><b>{t}</b></span>
            ))}
          </div>
        </div>

        <div className="vz-ctx__ctx">
          <span className="vz-rsn__lbl">Context</span>
          {CHIPS.map((c, i) => (
            <span className={`vz-ctx__chip ${i < chips ? 'is-on' : ''}`} key={c}><i />{c}</span>
          ))}
        </div>
      </div>

      <div className="vz-rsn__foot">
        <span>Illustrative</span>
        <span className="vz-ctx__key"><i />Normal range here</span>
      </div>
    </div>
  );
}
