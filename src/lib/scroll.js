import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced, sleep } from './hooks.js';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function scrollToY(y, immediate = false) {
  if (lenis) lenis.scrollTo(y, { immediate, force: true, duration: 1.4 });
  else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
}

export function scrollToEl(el, immediate = false) {
  const y = el.getBoundingClientRect().top + window.scrollY - 16;
  scrollToY(Math.max(0, y), immediate);
}

export function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? 'hidden' : '';
  if (lenis) (lock ? lenis.stop() : lenis.start());
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

/* Smooth scrolling (Lenis) kept in sync with GSAP ScrollTrigger, plus anchor handling */
export function initScroll() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  if (!reduced) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    if (!location.hash) lenis.scrollTo(0, { immediate: true, force: true });
    window.__lenis = lenis;
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    if (a.dataset.top !== undefined) { e.preventDefault(); scrollToY(0); return; }
    const url = new URL(a.href, location.href);
    if (!reduced && leavesPage(a, url, e)) {
      e.preventDefault();
      document.documentElement.classList.add('is-leaving');
      setTimeout(() => { location.href = a.href; }, 380);
      return;
    }
    if (!url.hash || !samePage(url)) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    history.replaceState(null, '', url.hash);
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  // Coming back through the browser cache must not leave the page faded out
  window.addEventListener('pageshow', (e) => { if (e.persisted) document.documentElement.classList.remove('is-leaving'); });
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
