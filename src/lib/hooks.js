import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

/* ------------------------------------------------------------------------------------------
   Motion preference: one live source of truth.
   motion off = the operating system asks for reduced motion OR the visitor pressed Pause motion.
   `reduced` is a live ES binding (read it inside effects and handlers, not at module load);
   components that must re-render on a change use useMotionOff(). The class html.motion-off lets
   CSS stop every animation and transition without any component knowing about it.
   ------------------------------------------------------------------------------------------ */
const OS_QUERY = '(prefers-reduced-motion: reduce)';
const KEY = 'hydris:pause-motion';
const win = typeof window !== 'undefined';
const osMq = win ? window.matchMedia(OS_QUERY) : null;
const readPause = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };

const pref = { os: !!osMq?.matches, paused: win ? readPause() : false };
const listeners = new Set();

export let reduced = pref.os || pref.paused;

function emit() {
  reduced = pref.os || pref.paused;
  if (win) document.documentElement.classList.toggle('motion-off', reduced);
  listeners.forEach((l) => l());
}
if (win) {
  document.documentElement.classList.toggle('motion-off', reduced);
  osMq.addEventListener('change', (e) => { pref.os = e.matches; emit(); });
  // Another tab changing the preference applies here too
  window.addEventListener('storage', (e) => { if (e.key === KEY) { pref.paused = e.newValue === '1'; emit(); } });
}

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
export const setPaused = (p) => {
  pref.paused = !!p;
  try { localStorage.setItem(KEY, p ? '1' : '0'); } catch { /* storage unavailable */ }
  emit();
};
/* True while all decorative motion should be off */
export const useMotionOff = () => useSyncExternalStore(subscribe, () => reduced, () => false);
/* True only when the visitor pressed Pause motion (not the OS setting) */
export const usePaused = () => useSyncExternalStore(subscribe, () => pref.paused, () => false);
/* True when the operating system asks for reduced motion (the Pause control cannot override that) */
export const useSystemReduced = () => useSyncExternalStore(subscribe, () => pref.os, () => false);
export const onMotionChange = (fn) => subscribe(fn);

/* Data Saver: skip heavy decorative media */
export const saveData = win && navigator.connection ? navigator.connection.saveData === true : false;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Live media query */
export function useMedia(query) {
  const sub = useCallback((l) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', l);
    return () => mq.removeEventListener('change', l);
  }, [query]);
  // The pre-rendered HTML assumes no match; the browser corrects it right after hydration
  return useSyncExternalStore(sub, () => window.matchMedia(query).matches, () => false);
}

/* Live in-view state (true while the element intersects) */
export function useInView({ rootMargin = '0px', threshold = 0, once = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) setInView(false);
    }, { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);
  return [ref, inView];
}

/* "Page ready" signal: there is no preloader any more, so this fires as soon as the shell mounts */
let readyFlag = false;
const readyListeners = new Set();
export function setReady() {
  if (readyFlag) return;
  readyFlag = true;
  document.documentElement.classList.add('is-ready');
  readyListeners.forEach((l) => l());
}
export function useReady() {
  const [ready, set] = useState(readyFlag);
  useEffect(() => {
    if (readyFlag) { set(true); return undefined; }
    const l = () => set(true);
    readyListeners.add(l);
    return () => readyListeners.delete(l);
  }, []);
  return ready;
}

/* Cancellable async loop that runs only while `active` is true and motion is allowed.
   It stops the moment motion is turned off and restarts when it is turned back on. */
export function useLoop(active, step, deps = []) {
  const off = useMotionOff();
  useEffect(() => {
    if (!active || off) return undefined;
    let alive = true;
    const isAlive = () => alive;
    (async () => {
      while (alive) {
        await step(isAlive);
        await sleep(16);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, off, ...deps]);
}

/* WebGL2 support */
export const hasWebGL2 = (() => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (gl) { const lc = gl.getExtension('WEBGL_lose_context'); if (lc) lc.loseContext(); }
    return !!gl;
  } catch { return false; }
})();
