import { useState } from 'react';
import { RowList } from '../components/sections/Blocks.jsx';
import Icon from '../components/ui/Icon.jsx';
import { Arrow, Reveal, SecHead, Words } from '../components/ui/Primitives.jsx';
import { EMAIL_PRESS, PRESS } from '../lib/content.js';

/* Reports success only when the clipboard write really succeeded; otherwise it says so and leaves
   the text for the visitor to select. */
function CopyButton({ text }) {
  const [state, setState] = useState('idle'); // idle | done | fail
  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error('unavailable');
      await navigator.clipboard.writeText(text);
      setState('done');
    } catch { setState('fail'); }
    setTimeout(() => setState('idle'), 2400);
  };
  return (
    <span className="copywrap">
      <button className="copy" type="button" onClick={copy}>
        <Icon name={state === 'done' ? 'check' : 'copy'} />{state === 'done' ? 'Copied' : state === 'fail' ? 'Not copied' : 'Copy'}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'done' ? 'Copied to the clipboard.' : state === 'fail' ? 'Copying failed. Select the text and copy it.' : ''}
      </span>
      {state === 'fail' && <span className="copywrap__fail" aria-hidden="true">Select the text to copy it</span>}
    </span>
  );
}

/* Logo files that exist in /brand today. The previews sit on the ground each file is made for. */
const LOGOS = [
  { name: 'Droplet mark', note: 'SVG, vector', file: '/brand/mark.svg', on: 'light' },
  { name: 'Droplet mark, black', note: 'PNG', file: '/brand/mark-black.png', on: 'light' },
  { name: 'Droplet mark, white', note: 'PNG, for dark backgrounds', file: '/brand/mark-white.png', on: 'dark' },
  { name: 'Wordmark', note: 'SVG, vector', file: '/brand/wordmark.svg', on: 'light' },
  { name: 'Logo with text, white', note: 'SVG, for dark backgrounds', file: '/brand/logo-with-text-white.svg', on: 'dark' },
  { name: 'Horizontal logo, dark', note: 'PNG', file: '/brand/logo-h-dark.png', on: 'light' },
];

export default function Press() {
  return (
    <>
      <section className="phero phero--press" aria-label="Press">
        <div className="phero__inner grid">
          <Reveal as="p" className="s-label phero__label">(Press) Hydris</Reveal>
          <Words as="h1" text={PRESS.title} className="t-xl phero__title" delay={0.1} />
          <Reveal as="p" className="lead phero__lead" delay={0.4}>
            {PRESS.lead} <a className="link-u" href={`mailto:${EMAIL_PRESS}`}>{EMAIL_PRESS}</a>. {PRESS.lead2}
          </Reveal>
        </div>
      </section>

      <section className="sec alt" id="copy">
        <SecHead index="01" label={PRESS.copyEyebrow} title={PRESS.copyTitle} />
        <RowList variant="rows--kit"
          rows={PRESS.copy.map((r) => ({ k: r.k, a: r.k, text: r.v, action: <CopyButton text={r.v} /> }))} />
      </section>

      <section className="sec" id="logos">
        <SecHead index="02" label="Downloads" title="Logos" />
        <ul className="logos grid">
          {LOGOS.map((l, i) => (
            <Reveal as="li" className={`logo logo--${l.on}`} key={l.file} delay={(i % 3) * 0.06}>
              <a className="logo__prev" href={l.file} download tabIndex={-1} aria-hidden="true">
                <img src={l.file} alt="" loading="lazy" decoding="async" />
              </a>
              <div className="logo__meta">
                <p className="logo__name">{l.name}</p>
                <p className="s-label logo__note">{l.note}</p>
              </div>
              <a className="link-u logo__get" href={l.file} download aria-label={`Download ${l.name}`}>Download <Arrow dir="down" /></a>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="sec alt" id="assets">
        <SecHead index="03" label={PRESS.assetsEyebrow} title={PRESS.assetsTitle} />
        <RowList variant="rows--kit"
          rows={[
            ...PRESS.assets.filter((r) => r.k !== 'Logos').map((r) => ({ k: r.k, a: r.k, text: r.v })),
            {
              k: 'On request', a: 'On request',
              text: 'Founder photography, product captures and the full press kit are not on this page yet. Ask and we will tell you what is ready, and for what use it is cleared.',
              action: <a className="pill" href={`mailto:${EMAIL_PRESS}?subject=${encodeURIComponent('Press materials')}`}>Ask for press materials <Arrow /></a>,
            },
          ]} />
      </section>
    </>
  );
}
