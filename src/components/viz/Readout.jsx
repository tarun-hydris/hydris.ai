import { Fragment, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LOOKS } from '../../lib/content.js';
import { reduced, useInView, useMotionOff } from '../../lib/hooks.js';
import { Mark } from '../ui/Brand.jsx';
import Icon from '../ui/Icon.jsx';
import '../../styles/viz/readout.css';

/* The plant readout, drawn as small multiples on frosted glass.
   On entry the rows settle, each trace draws in, the values count up and the
   statuses arrive. A scan passes down the rows and the view settles on the one
   reading that is drifting; the Hydris note then writes itself, ties its facts
   back to the chart and lands on the recommendation. While in view the clock
   ticks, the scan repeats every few seconds and the drifting value keeps
   creeping up. Every trace is an illustration seeded from the row name, not
   plant data. The whole card is one image to assistive tech (LOOKS.alt). */

/* ---------- Timing, in ms ---------- */
const COUNT_AT = 260; // first value starts counting
const COUNT_STAGGER = 80;
const COUNT_MS = 950;
const SCAN_FIRST = 1500; // first sweep, after the traces have drawn
const SCAN_AGAIN = 700; // first sweep when the card comes back into view
const SCAN_MS = 1500;
const SCAN_EVERY = 8000;
const NOTE_GAP = 320; // the scan settles, then the note starts writing
const DRIFT_EVERY = 2800;
const DRIFT_MS = 700;
/* Small upward ticks for the drifting reading; once spent, the value holds */
const DRIFT = [4, 2, 5, 3, 6, 2, 4, 5, 3, 4, 2, 5, 3, 4];

/* ---------- Window and grid (visual parameters) ---------- */
const STEPS = 48; // intervals across the window
const SPAN_MIN = 480; // 8 hours: wide enough to hold the 18:40 feed change before 02:14
const STEP_MIN = SPAN_MIN / STEPS;
const PAD = 3; // vertical breathing room inside each plot, px
const MINUS = '−';
const NNBSP = ' '; // narrow no-break space for digit grouping
const SPAN_LABEL = `${MINUS}${SPAN_MIN / 60}h`;
const TICKS = [0, 0.25, 0.5, 0.75, 1];
const tickLabel = (p) => (p === 1 ? 'now' : `${MINUS}${Math.round(((1 - p) * SPAN_MIN) / 60)}h`);
/* Half width of each stable row's normal band, in the row's own units */
const BAND = { pH: 0.2, Oxygen: 0.3, 'Discharge quality': 8, Flow: 12 };

const SCAN_FRAMES = [
  { transform: 'translateY(-100%)', opacity: 0 },
  { opacity: 1, offset: 0.1 },
  { opacity: 1, offset: 0.86 },
  { transform: 'translateY(0%)', opacity: 0 },
];
const FLASH_FRAMES = [{ opacity: 0 }, { opacity: 1, offset: 0.18 }, { opacity: 0 }];

/* ---------- Helpers ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeOut = (p) => 1 - (1 - p) ** 4;

function fmt(n, dec, group) {
  const s = Math.abs(n) < 1e-9 ? (0).toFixed(dec) : n.toFixed(dec);
  if (!group) return s;
  const [i, d] = s.split('.');
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP) + (d ? `.${d}` : '');
}

const pad2 = (n) => String(n).padStart(2, '0');
function hm(min) {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
}
function clockParts(sec) {
  const s = ((sec % 86400) + 86400) % 86400;
  return [`${pad2(Math.floor(s / 3600))}:${pad2(Math.floor(s / 60) % 60)}`, `:${pad2(s % 60)}`];
}

/* Deterministic noise: a hash of the row name seeds a small PRNG (mulberry32) */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* A smooth sensor-like wobble in roughly -1..1 */
function wobble(seed, n) {
  const r = rng(seed);
  const p1 = r() * 6.283; const p2 = r() * 6.283; const p3 = r() * 6.283;
  const f1 = 0.15 + r() * 0.08; const f2 = 0.4 + r() * 0.15; const f3 = 1.05 + r() * 0.4;
  return Array.from({ length: n }, (_, i) => 0.55 * Math.sin(i * f1 + p1) + 0.3 * Math.sin(i * f2 + p2)
    + 0.12 * Math.sin(i * f3 + p3) + (r() - 0.5) * 0.06);
}

/* The drifting trace: level until the feed change, then a steady climb that crosses
   the dashed limit at the -6h tick (so "drifting 6h" reads straight off the chart) */
function climb(v, seed, markP) {
  const rise = v * 0.052;
  const base = v - rise;
  const n = wobble(seed, STEPS + 1);
  const shape = (t) => (t <= markP ? 0 : ((t - markP) / (1 - markP)) ** 1.12);
  const series = n.map((x, i) => base + rise * shape(i / STEPS) + x * rise * 0.025);
  series[STEPS] = v;
  const thrP = Math.max(0.25, markP + 0.1);
  return { series, thr: base + rise * shape(thrP), dom: [base - rise * 0.3, v + rise * 0.4] };
}

function buildModel() {
  const [hh = 2, mm = 14] = String(LOOKS.head[2] || '02:14').split(':').map(Number);
  const nowMin = hh * 60 + mm;
  const startMin = nowMin - SPAN_MIN;
  const text = LOOKS.note.map(([t]) => t).join('');
  const hit = text.match(/(\d{1,2}):(\d{2})/);
  let markP = null;
  let markLabel = null;
  if (hit) {
    const at = Number(hit[1]) * 60 + Number(hit[2]);
    const d = (((at - startMin) % 1440) + 1440) % 1440;
    if (d > 0 && d < SPAN_MIN * 0.6) { markP = d / SPAN_MIN; markLabel = `${hit[1].padStart(2, '0')}:${hit[2]}`; }
  }
  const rows = LOOKS.rows.map((r) => {
    const raw = String(r.v);
    const num = parseFloat(raw.replace(/\s/g, ''));
    const dec = (raw.split('.')[1] || '').length;
    const group = /\s/.test(raw);
    const seed = hash(r.p);
    const status = r.s.charAt(0).toUpperCase() + r.s.slice(1);
    if (r.alert) return { ...r, num, dec, group, status, ...climb(num, seed, markP ?? 0.06) };
    const bh = BAND[r.p] ?? Math.max(Math.abs(num) * 0.04, 10 ** -dec);
    const w = wobble(seed, STEPS + 1);
    const last = w[STEPS];
    return {
      ...r, num, dec, group, status,
      series: w.map((x) => num + bh * 0.4 * (x - last)),
      band: [num - bh, num + bh],
      dom: [num - bh * 2.2, num + bh * 2.2],
    };
  });
  return { nowMin, startMin, markP, markLabel, rows };
}
const MODEL = buildModel();

/* The note as word spans (each with its own reveal index), bold phrases wrapped so
   their underline can draw once their last word is in. The closing bold sentence is
   held back as the recommendation. */
function buildNote() {
  const segs = LOOKS.note;
  const tail = segs[segs.length - 1];
  const recSeg = tail && tail[1] ? tail : null;
  const body = recSeg ? segs.slice(0, -1) : segs;
  let w = 0;
  const ends = [];
  const bolds = [];
  const parts = body.map(([text, bold], si) => {
    const toks = text.split(/(\s+)/).filter(Boolean).map((tok, ti) => (/^\s+$/.test(tok)
      ? tok
      : <span key={ti} className="vz-ro__w" style={{ '--w': w++ }}>{tok}</span>));
    if (!bold) return <Fragment key={si}>{toks}</Fragment>;
    ends.push(w - 1);
    bolds.push(text.trim());
    return <span key={si} className="vz-ro__b" style={{ '--u': w - 1 }}>{toks}</span>;
  });
  const full = body.map(([t]) => t).join('');
  const links = [];
  if (bolds[0]) links.push({ icon: 'clock', label: bolds[0], u: ends[0], chart: true });
  if (bolds[1]) links.push({ icon: 'cal', label: /settling problem/.test(full) ? `${bolds[1]} settling problem` : bolds[1], u: ends[1] });
  return { parts, count: w, rec: recSeg ? recSeg[0].trim() : '', links, firstEnd: ends[0] ?? 0 };
}

const yOf = (row, box, v) => PAD + (1 - (v - row.dom[0]) / (row.dom[1] - row.dom[0])) * (box.h - PAD * 2);

function tracePaths(row, box, head) {
  let d = '';
  for (let i = 0; i <= STEPS; i += 1) {
    const v = i === STEPS ? head : row.series[i];
    d += `${i ? 'L' : 'M'}${((i / STEPS) * box.w).toFixed(1)} ${yOf(row, box, v).toFixed(1)}`;
  }
  return { line: d, area: `${d}L${box.w} ${box.h}L0 ${box.h}Z` };
}

/* One sparkline. Sized in real pixels (ResizeObserver) so strokes stay crisp and
   stroke-dashoffset draws evenly. Exposes an imperative API to the readout for the
   live head and the hover crosshair, so nothing here re-renders per frame. */
function Spark({ row, index, apis }) {
  const gid = `vzro${useId().replace(/[^\w-]/g, '')}`;
  const rootRef = useRef(null);
  const plotRef = useRef(null);
  const lineRef = useRef(null);
  const areaRef = useRef(null);
  const headRef = useRef(null);
  const xhRef = useRef(null);
  const dotRef = useRef(null);
  const tipRef = useRef(null);
  const tipT = useRef(null);
  const tipV = useRef(null);
  const headV = useRef(row.series[STEPS]);
  const boxRef = useRef(null);
  const [box, setBox] = useState(null);

  useLayoutEffect(() => { boxRef.current = box; }, [box]);

  useLayoutEffect(() => {
    const el = plotRef.current;
    if (!el) return undefined;
    const take = (w, h) => {
      const W = Math.round(w); const H = Math.round(h);
      if (W < 8 || H < 8) return; // hidden (display: none) at this width
      setBox((b) => (b && b.w === W && b.h === H ? b : { w: W, h: H }));
    };
    take(el.clientWidth, el.clientHeight);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => { const r = entries[0].contentRect; take(r.width, r.height); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let px = 0;
    const show = (x, v, time) => {
      const b = boxRef.current; const root = rootRef.current;
      if (!b || !root || !xhRef.current || !dotRef.current || !tipRef.current) return;
      xhRef.current.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      dotRef.current.style.transform = `translate3d(0,${yOf(row, b, v).toFixed(1)}px,0)`;
      tipT.current.textContent = time;
      tipV.current.textContent = fmt(v, row.dec, row.group);
      const tw = tipRef.current.offsetWidth;
      tipRef.current.style.transform = `translate3d(${clamp(x - tw / 2, -6, b.w - tw + 6).toFixed(1)}px,0,0)`;
      root.classList.add('is-x');
    };
    const frame = () => {
      raf = 0;
      const el = plotRef.current; const b = boxRef.current;
      if (!el || !b) return;
      const r = el.getBoundingClientRect();
      // Over the trace: snap to the nearest sample. Elsewhere on the row: read "now".
      const i = px >= r.left && px <= r.right ? Math.round(((px - r.left) / r.width) * STEPS) : STEPS;
      show((i / STEPS) * b.w, i === STEPS ? headV.current : row.series[i], hm(MODEL.startMin + i * STEP_MIN));
    };
    const api = {
      setHead(v) {
        headV.current = v;
        const b = boxRef.current;
        if (!b) return;
        const p = tracePaths(row, b, v);
        if (lineRef.current) lineRef.current.setAttribute('d', p.line);
        if (areaRef.current) areaRef.current.setAttribute('d', p.area);
        if (headRef.current) headRef.current.style.transform = `translate3d(${b.w}px,${yOf(row, b, v).toFixed(1)}px,0)`;
      },
      hover(clientX) {
        px = clientX;
        if (!raf) raf = requestAnimationFrame(frame);
      },
      hoverAt(p, label) {
        const b = boxRef.current;
        if (!b) return;
        cancelAnimationFrame(raf); raf = 0;
        const f = clamp(p, 0, 1) * STEPS; const i0 = Math.floor(f); const i1 = Math.min(STEPS, i0 + 1);
        const at = (i) => (i === STEPS ? headV.current : row.series[i]);
        show(p * b.w, at(i0) + (at(i1) - at(i0)) * (f - i0), label);
      },
      leave() {
        cancelAnimationFrame(raf); raf = 0;
        if (rootRef.current) rootRef.current.classList.remove('is-x');
      },
    };
    const list = apis.current;
    list[index] = api;
    return () => { cancelAnimationFrame(raf); if (list[index] === api) list[index] = null; };
  }, [apis, index, row]);

  const g = box ? tracePaths(row, box, headV.current) : null;
  const mx = box && row.alert && MODEL.markP != null ? MODEL.markP * box.w : null;
  return (
    <div className="vz-ro__spark" ref={rootRef}>
      <div className="vz-ro__plot" ref={plotRef}>
        {box && (
          <svg className="vz-ro__svg" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} focusable="false" aria-hidden="true">
            {row.alert && (
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1746e4" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#1746e4" stopOpacity="0" />
                </linearGradient>
              </defs>
            )}
            <g className="vz-ro__grid">
              {[0.25, 0.5, 0.75].map((p) => <line key={p} x1={p * box.w} x2={p * box.w} y1="0" y2={box.h} />)}
            </g>
            {row.band && (
              <rect className="vz-ro__band" x="0" width={box.w} y={yOf(row, box, row.band[1])}
                height={yOf(row, box, row.band[0]) - yOf(row, box, row.band[1])} />
            )}
            {row.alert && <path ref={areaRef} className="vz-ro__area" d={g.area} fill={`url(#${gid})`} />}
            {row.thr != null && (
              <line className="vz-ro__thr" x1="0" x2={box.w} y1={yOf(row, box, row.thr)} y2={yOf(row, box, row.thr)} />
            )}
            {mx != null && <line className="vz-ro__mk" x1={mx} x2={mx} y1="0" y2={box.h} />}
            <path ref={lineRef} className="vz-ro__line" d={g.line} pathLength="1" />
          </svg>
        )}
        {mx != null && (
          <span className="vz-ro__mklbl" style={{ transform: `translate3d(${(mx + 3).toFixed(1)}px,0,0)` }}>{MODEL.markLabel}</span>
        )}
        <span className="vz-ro__hp" ref={headRef}
          style={box ? { transform: `translate3d(${box.w}px,${yOf(row, box, headV.current).toFixed(1)}px,0)` } : undefined}><i /></span>
        <span className="vz-ro__xh" ref={xhRef}><i ref={dotRef} /></span>
        <span className="vz-ro__tip" ref={tipRef}><em ref={tipT} /><b ref={tipV} /></span>
      </div>
      {row.alert && <span className="vz-ro__mini"><span>{SPAN_LABEL}</span><span>now</span></span>}
    </div>
  );
}

export function Readout() {
  useMotionOff(); // re-render when Pause motion or the system setting changes
  const rows = MODEL.rows;
  const alertIdx = rows.findIndex((r) => r.alert);
  const note = useMemo(buildNote, []);
  const [rootRef, live] = useInView({ threshold: 0 }); // loops run only while any of it is on screen
  const [cardRef, seen] = useInView({ threshold: 0.3, once: true }); // the entry sequence
  const [stage, setStage] = useState(reduced ? 3 : 0); // 1 in, 2 focus on the drift, 3 note
  const entered = stage >= 1;
  const focused = stage >= 2;

  const apis = useRef([]);
  const numRefs = useRef([]);
  const flashRefs = useRef([]);
  const clockHM = useRef(null);
  const clockS = useRef(null);
  const rowsRef = useRef(null);
  const scanRef = useRef(null);
  const secRef = useRef(MODEL.nowMin * 60);
  const liveV = useRef(alertIdx >= 0 ? rows[alertIdx].num : 0);
  const driftStep = useRef(0);
  const focusDone = useRef(reduced);

  const valueText = (i) => {
    const r = rows[i];
    return fmt(i === alertIdx ? Math.round(liveV.current) : r.num, r.dec, r.group);
  };

  /* Values are written imperatively (count-up, live drift), never through React state */
  useLayoutEffect(() => {
    rows.forEach((_, i) => { if (numRefs.current[i]) numRefs.current[i].textContent = valueText(i); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (seen) setStage((s) => (s < 1 ? 1 : s)); }, [seen]);

  /* Count every value up from zero, staggered by row */
  useEffect(() => {
    if (!entered || reduced) return undefined;
    let raf = 0;
    const t0 = performance.now();
    const step = (now) => {
      let busy = false;
      rows.forEach((r, i) => {
        const el = numRefs.current[i];
        if (!el) return;
        const p = clamp((now - t0 - COUNT_AT - i * COUNT_STAGGER) / COUNT_MS, 0, 1);
        if (p < 1) busy = true;
        el.textContent = fmt(r.num * easeOut(p), r.dec, r.group);
      });
      if (busy) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      rows.forEach((_, i) => { if (numRefs.current[i]) numRefs.current[i].textContent = valueText(i); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered]);

  /* The clock: 02:14:00 and counting, only while on screen */
  useEffect(() => {
    if (!live || !entered || reduced) return undefined;
    const id = setInterval(() => {
      secRef.current += 1;
      const [a, b] = clockParts(secRef.current);
      if (clockHM.current) clockHM.current.textContent = a;
      if (clockS.current) clockS.current.textContent = b;
    }, 1000);
    return () => clearInterval(id);
  }, [live, entered]);

  /* The scan: once after entry, then every few seconds. The first pass that reaches the
     drifting row hands focus to it. */
  useEffect(() => {
    if (!live || !entered || reduced) return undefined;
    const timers = new Set();
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
    let iv = 0;
    const alertAt = () => {
      const box = rowsRef.current;
      const el = box && box.querySelector('.vz-ro__row.is-alert');
      if (!box || !el || !box.clientHeight) return 1;
      return clamp((el.offsetTop + el.offsetHeight / 2) / box.clientHeight, 0, 1);
    };
    const sweep = () => {
      const scan = scanRef.current;
      if (scan && scan.animate) scan.animate(SCAN_FRAMES, { duration: SCAN_MS, easing: 'linear' });
      if (!focusDone.current) {
        later(() => { focusDone.current = true; setStage((s) => (s < 2 ? 2 : s)); }, SCAN_MS * alertAt());
      }
    };
    later(() => { sweep(); iv = setInterval(sweep, SCAN_EVERY); }, focusDone.current ? SCAN_AGAIN : SCAN_FIRST);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(iv);
      const scan = scanRef.current;
      if (scan && scan.getAnimations) scan.getAnimations().forEach((a) => a.cancel());
    };
  }, [live, entered]);

  /* Focus settles, then the note writes (pure CSS from here, so it finishes even off screen) */
  useEffect(() => {
    if (stage !== 2) return undefined;
    const t = setTimeout(() => setStage(3), NOTE_GAP);
    return () => clearTimeout(t);
  }, [stage]);

  /* The drifting reading keeps creeping up: a short count-to, the trace head follows,
     a soft flash marks the change. At most one update every 2.8 s. */
  useEffect(() => {
    if (!live || !focused || reduced || alertIdx < 0) return undefined;
    const r = rows[alertIdx];
    let raf = 0;
    const settle = () => {
      cancelAnimationFrame(raf); raf = 0;
      const el = numRefs.current[alertIdx];
      if (el) el.textContent = fmt(Math.round(liveV.current), r.dec, r.group);
      if (apis.current[alertIdx]) apis.current[alertIdx].setHead(liveV.current);
    };
    const id = setInterval(() => {
      if (driftStep.current >= DRIFT.length) { clearInterval(id); return; }
      settle();
      const from = liveV.current;
      const to = from + DRIFT[driftStep.current];
      driftStep.current += 1;
      liveV.current = to;
      const flash = flashRefs.current[alertIdx];
      if (flash && flash.animate) flash.animate(FLASH_FRAMES, { duration: 1100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      const t0 = performance.now();
      const step = (now) => {
        const p = clamp((now - t0) / DRIFT_MS, 0, 1);
        const v = from + (to - from) * easeOut(p);
        const el = numRefs.current[alertIdx];
        if (el) el.textContent = fmt(Math.round(v), r.dec, r.group);
        if (apis.current[alertIdx]) apis.current[alertIdx].setHead(v);
        raf = p < 1 ? requestAnimationFrame(step) : 0;
      };
      raf = requestAnimationFrame(step);
    }, DRIFT_EVERY);
    return () => { clearInterval(id); settle(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, focused]);

  const [plant, shift] = LOOKS.head;
  const [hm0, s0] = clockParts(MODEL.nowMin * 60);
  const cls = ['vz-ro', entered && 'is-in', focused && 'is-focus', stage >= 3 && 'is-note', live && 'is-live'].filter(Boolean).join(' ');
  const hoverChart = (on) => {
    const api = apis.current[alertIdx];
    if (!api) return;
    if (on) api.hoverAt(MODEL.markP, MODEL.markLabel); else api.leave();
  };

  return (
    <div ref={rootRef} className={cls} style={{ '--nw': note.count, '--u1': note.firstEnd }}>
      <div ref={cardRef} className="vz-ro__card" role="img" aria-label={LOOKS.alt}>
        <div className="vz-ro__head" aria-hidden="true">
          <span className="vz-ro__live" />
          <span>{plant}</span>
          <span className="vz-ro__sep">·</span>
          <span>{shift}</span>
          <span className="vz-ro__meta">
            <span className="vz-ro__win">Live window <b>{SPAN_LABEL}</b></span>
            <span className="vz-ro__clock"><span ref={clockHM}>{hm0}</span><span className="vz-ro__sec" ref={clockS}>{s0}</span></span>
          </span>
        </div>

        <div className="vz-ro__cols" aria-hidden="true">
          <span>Parameter</span>
          <span className="vz-ro__c-spark">Last {SPAN_MIN / 60}h</span>
          <span className="vz-ro__c-r">Value</span>
          <span className="vz-ro__c-r">Status</span>
        </div>

        <div className="vz-ro__rows" ref={rowsRef} aria-hidden="true">
          <div className="vz-ro__scanwrap"><div className="vz-ro__scan" ref={scanRef} /></div>
          {rows.map((r, i) => (
            <div
              key={r.p}
              className={`vz-ro__row${r.alert ? ' is-alert' : ''}`}
              style={{ '--i': i }}
              onPointerEnter={(e) => apis.current[i] && apis.current[i].hover(e.clientX)}
              onPointerMove={(e) => apis.current[i] && apis.current[i].hover(e.clientX)}
              onPointerLeave={() => apis.current[i] && apis.current[i].leave()}
            >
              <span className="vz-ro__p">{r.p}</span>
              <Spark row={r} index={i} apis={apis} />
              <span className="vz-ro__v">
                <span className="vz-ro__flash" ref={(el) => { flashRefs.current[i] = el; }} />
                <span className="vz-ro__num" ref={(el) => { numRefs.current[i] = el; }} />
              </span>
              <span className="vz-ro__s">
                <span className={`vz-ro__pill${r.alert ? ' is-drift' : ''}`}>
                  <i className="vz-ro__dot" />
                  {r.status}
                  {r.alert && <Icon name="arrow" className="vz-ro__trend" />}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="vz-ro__axis" aria-hidden="true">
          <span className="vz-ro__ticks">
            {TICKS.map((p) => <span key={p} style={{ left: `${p * 100}%` }}>{tickLabel(p)}</span>)}
          </span>
        </div>

        <div className="vz-ro__note" aria-hidden="true">
          <p className="vz-ro__lbl"><Mark className="vz-ro__logo" /><span>Hydris</span></p>
          <p className="vz-ro__txt">{note.parts}</p>
          {note.rec && (
            <p className="vz-ro__rec">
              <svg className="vz-ro__ok" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle cx="10" cy="10" r="8.6" pathLength="1" />
                <path d="M6.3 10.3l2.6 2.6 4.9-5.4" pathLength="1" />
              </svg>
              <span className="vz-ro__b vz-ro__b--rec">{note.rec}</span>
            </p>
          )}
          {note.links.length > 0 && (
            <div className="vz-ro__links">
              <span className="vz-ro__lk">Linked</span>
              {note.links.map((l) => {
                const chart = l.chart && MODEL.markP != null && alertIdx >= 0;
                return (
                  <span
                    key={l.label}
                    className={`vz-ro__chip${chart ? ' is-chart' : ''}`}
                    style={{ '--u': l.u }}
                    onPointerEnter={chart ? () => hoverChart(true) : undefined}
                    onPointerLeave={chart ? () => hoverChart(false) : undefined}
                  >
                    <Icon name={l.icon} />
                    {l.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <p className="vz-ro__cap">{LOOKS.caption}</p>
    </div>
  );
}

export default Readout;
