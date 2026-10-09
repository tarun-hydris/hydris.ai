import { useEffect, useRef, useState } from 'react';

export const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Live media query */
export function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    on();
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
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

/* "Page ready" signal: fired when the preloader lifts (or immediately without one) */
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

/* Cancellable async loop that runs only while `active` is true */
export function useLoop(active, step, deps = []) {
  useEffect(() => {
    if (!active || reduced) return undefined;
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
  }, [active, ...deps]);
}

/* WebGL2 support (for the liquid-metal logo) */
export const hasWebGL2 = (() => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (gl) { const lc = gl.getExtension('WEBGL_lose_context'); if (lc) lc.loseContext(); }
    return !!gl;
  } catch { return false; }
})();
