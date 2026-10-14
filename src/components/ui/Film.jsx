import { useEffect, useRef } from 'react';

/* The Hydris platform film, in a modal player. Any element can open it with openFilm(), and a link to
   "#film" opens it too. Closing pauses the film and returns focus to whatever opened it. */
const EVENT = 'hydris:film';
export const FILM_SRC = '/video/hydris-platform-film.mp4';
export const FILM_POSTER = '/film/poster-1280.webp';

export function openFilm() {
  window.dispatchEvent(new Event(EVENT));
}

export function FilmButton({ className = '', children }) {
  return (
    <button type="button" className={className} onClick={openFilm} aria-haspopup="dialog">
      <svg className="filmbtn__play" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M5 3.2v9.6L12.6 8z" /></svg>
      {children}
    </button>
  );
}

export function FilmDialog() {
  const dlg = useRef(null);
  const vid = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return undefined;
    const open = () => {
      if (d.open) return;
      opener.current = document.activeElement;
      d.showModal();
      document.documentElement.classList.add('film-open');
      if (window.__lenis) window.__lenis.stop();
      const v = vid.current;
      if (v) { v.currentTime = v.currentTime || 0; v.play().catch(() => {}); }
    };
    const onClose = () => {
      if (vid.current) vid.current.pause();
      document.documentElement.classList.remove('film-open');
      if (window.__lenis) window.__lenis.start();
      if (window.location.hash === '#film') history.replaceState(null, '', window.location.pathname + window.location.search);
      if (opener.current && opener.current.focus) opener.current.focus();
    };
    const onHash = () => { if (window.location.hash === '#film') open(); };
    // A click on the dark area around the player closes it
    const onClick = (e) => { if (e.target === d) d.close(); };
    window.addEventListener(EVENT, open);
    window.addEventListener('hashchange', onHash);
    d.addEventListener('close', onClose);
    d.addEventListener('click', onClick);
    onHash();
    return () => {
      window.removeEventListener(EVENT, open);
      window.removeEventListener('hashchange', onHash);
      d.removeEventListener('close', onClose);
      d.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <dialog ref={dlg} className="film" aria-label="The Hydris platform film">
      <div className="film__frame">
        <video ref={vid} className="film__vid" src={FILM_SRC} poster={FILM_POSTER} controls playsInline preload="none" />
        <div className="film__bar">
          <p className="film__title">The Hydris platform film <span>4 min</span></p>
          <form method="dialog"><button className="film__close" type="submit" aria-label="Close the film">Close <span aria-hidden="true">&times;</span></button></form>
        </div>
      </div>
    </dialog>
  );
}
