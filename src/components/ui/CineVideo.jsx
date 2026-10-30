import { useEffect, useRef, useState } from 'react';
import { saveData, useMotionOff } from '../../lib/hooks.js';

/* One film, three encodes. The smallest suits phones and touch screens; larger screens take AV1 where
   the browser can decode it and H.264 otherwise. The poster is the same composition, so the page looks
   identical before playback, when playback fails, when Data Saver is on and when motion is off. */
const POSTER = '/video/cine.webp';
const canAv1 = () => {
  try { return document.createElement('video').canPlayType('video/mp4; codecs="av01.0.08M.08"') !== ''; } catch { return false; }
};
const pickSource = () => {
  const small = window.innerWidth < 760 || window.matchMedia('(pointer: coarse)').matches;
  if (small) return '/video/cine-1080.mp4';
  return canAv1() ? '/video/cine-1920.av1.mp4' : '/video/cine-1920.mp4';
};

export default function CineVideo({ className = '', priority = false, poster = POSTER }) {
  const ref = useRef(null);
  const off = useMotionOff();
  const [failed, setFailed] = useState(false);
  // The encode depends on the screen, so it is chosen in the browser; the pre-rendered page shows the poster
  const [src, setSrc] = useState(null);
  useEffect(() => { setSrc(pickSource()); }, []);
  const still = off || saveData || failed;

  /* Play only while the element is on screen and the tab is visible; pause the moment either stops */
  useEffect(() => {
    const v = ref.current;
    if (!v || still || !src) return undefined;
    let onScreen = false;
    let tabVisible = document.visibilityState === 'visible';
    const sync = () => {
      if (onScreen && tabVisible) v.play().catch(() => { /* autoplay blocked: the poster stays */ });
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: 0.05 });
    io.observe(v);
    const onVis = () => { tabVisible = document.visibilityState === 'visible'; sync(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); v.pause(); };
  }, [still, src]);

  if (still) return <img className={`cine cine--still ${className}`} src={poster} alt="" width="1920" height="1080" decoding="async" fetchPriority={priority ? 'high' : undefined} />;
  return (
    <video
      ref={ref} className={`cine ${className}`} src={src || undefined} poster={poster} muted loop playsInline
      preload={priority ? 'auto' : 'metadata'} disablePictureInPicture aria-hidden="true" tabIndex={-1}
      onError={() => setFailed(true)}
    />
  );
}
