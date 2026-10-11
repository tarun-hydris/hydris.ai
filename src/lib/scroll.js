import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMotionChange, reduced, sleep } from './hooks.js';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let tick = null;
let started = false;
let stopListeners = [];

export function scrollToY(y, immediate = false) {
  if (lenis) lenis.scrollTo(y, { immediate, force: true, duration: 1.2 });
  else window.scrollTo({ top: y, behavior: immediate || reduced ? 'auto' : 'smooth' });
}

export function scrollToEl(el, immediate = false) {
  const y = el.getBoundingClientRect().top + window.scrollY - 16;
  scrollToY(Math.max(0, y), immediate);
}

const samePage = (url) => {
  const norm = (p) => p.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  return url.origin === location.origin && norm(url.pathname) === norm(location.pathname);
};

/* A plain click on a link to another page of this site (not a new tab, download or mailto) */
const leavesPage = (a, url, e) =>
  !e.defaultPrevented && e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
  && (!a.target || a.target === '_self') && !a.hasAttribute('download')
  && url.origin === location.origin && !samePage(url);

/* Smooth scrolling exists only while motion is allowed; ordinary document scrolling otherwise */
function startLenis() {
  if (lenis) return;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.2 });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
}
function stopLenis() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null; tick = null;
  delete window.__lenis;
  ScrollTrigger.refresh();
}

/* Idempotent: calling it again does nothing; the returned function undoes everything it set up */
export function initScroll() {
  if (started) return () => {};
  started = true;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  if (!reduced) startLenis();
  stopListeners.push(onMotionChange(() => { if (reduced) stopLenis(); else startLenis(); }));

  const onClick = (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    if (a.dataset.top !== undefined) { e.preventDefault(); scrollToY(0); return; }
    const url = new URL(a.href, location.href);
    if (!reduced && leavesPage(a, url, e)) {
      e.preventDefault();
      document.documentElement.classList.add('is-leaving');
      setTimeout(() => { location.href = a.href; }, 320);
      // If the navigation is cancelled, do not leave the page faded out
      setTimeout(() => document.documentElement.classList.remove('is-leaving'), 2500);
      return;
    }
    if (!url.hash || !samePage(url)) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.replaceState(null, '', url.hash);
  };
  const onLoad = () => ScrollTrigger.refresh();
  // Coming back through the browser cache must not leave the page faded out
  const onShow = (e) => { if (e.persisted) document.documentElement.classList.remove('is-leaving'); };
  document.addEventListener('click', onClick);
  window.addEventListener('load', onLoad);
  window.addEventListener('pageshow', onShow);
  stopListeners.push(() => {
    document.removeEventListener('click', onClick);
    window.removeEventListener('load', onLoad);
    window.removeEventListener('pageshow', onShow);
  });

  return () => {
    stopListeners.forEach((f) => f());
    stopListeners = [];
    stopLenis();
    started = false;
  };
}

/* After the page is ready: honour a #hash coming from another page */
export async function scrollToHashWhenReady() {
  if (!location.hash) return;
  const id = decodeURIComponent(location.hash.slice(1));
  for (let i = 0; i < 40; i++) {
    const el = document.getElementById(id);
    if (el) {
      await Promise.all([document.fonts ? document.fonts.ready : null, sleep(400)]);
      if (lenis) lenis.resize();
      ScrollTrigger.refresh();
      scrollToEl(el, true);
      return;
    }
    await sleep(100);
  }
}
