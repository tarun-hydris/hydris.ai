import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { Mark } from './Brand.jsx';
import { Arrow } from './Icon.jsx';
import { CTA } from '../../lib/content.js';
import { GREETING, STARTERS, answerById, questionFor, reply } from '../../lib/assistant.js';
import { useMotionOff } from '../../lib/hooks.js';
import '../../styles/chat.css';

/* Ask Hydris. A launcher in the corner of every page that opens a small chat. Answers come from
   src/lib/assistant.js, matched in the browser: no API, nothing typed leaves the page. The conversation
   is kept for the visit (sessionStorage), so it survives moving between pages. */

const STORE = 'hydris:ask';
const load = () => {
  try { return JSON.parse(sessionStorage.getItem(STORE)) || null; } catch { return null; }
};
const save = (state) => {
  try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch { /* storage unavailable */ }
};

/* Answer text: paragraphs, "- " bullets, and [text](/path/) links, as elements (never HTML strings) */
function Inline({ text }) {
  const out = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|([\w.+-]+@[\w-]+\.[\w.]+)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<a key={m.index} href={m[2]}>{m[1]}</a>);
    else out.push(<a key={m.index} href={`mailto:${m[3]}`}>{m[3]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Answer({ paras }) {
  const blocks = [];
  for (const p of paras) {
    if (p.startsWith('- ')) {
      const prev = blocks[blocks.length - 1];
      if (prev && prev.list) prev.items.push(p.slice(2));
      else blocks.push({ list: true, items: [p.slice(2)] });
    } else blocks.push({ list: false, text: p });
  }
  return blocks.map((b, i) => (b.list
    ? <ul key={i}>{b.items.map((t, k) => <li key={k}><Inline text={t} /></li>)}</ul>
    : <p key={i}><Inline text={b.text} /></p>));
}

const words = (paras) => paras.join(' ').split(/\s+/).length;

export default function Chat() {
  const uid = useId();
  const off = useMotionOff();
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState([]);           // { who: 'me' | 'bot', text?, paras?, next?, cta? }
  const [typing, setTyping] = useState(false);
  const [shown, setShown] = useState(Infinity); // how many words of the newest answer are visible
  const [draft, setDraft] = useState('');
  const [said, setSaid] = useState('');         // the newest answer, for screen readers
  const launcher = useRef(null);
  const input = useRef(null);
  const body = useRef(null);
  const timers = useRef([]);

  // Restore the visit's conversation once in the browser (the pre-rendered page shows only the launcher)
  useEffect(() => {
    const s = load();
    if (s?.log?.length) setLog(s.log);
    if (s?.open) setOpen(true);
  }, []);
  useEffect(() => { save({ log, open }); }, [log, open]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!open) return undefined;
    if (!log.length) setLog([{ who: 'bot', paras: GREETING.a, next: GREETING.next.map((id) => ({ id, q: questionFor(id) })) }]);
    const t = setTimeout(() => input.current?.focus(), 60);
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the newest message in view
  useEffect(() => {
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, typing, shown, open]);

  function close() {
    setOpen(false);
    launcher.current?.focus();
  }

  // The bot "thinks" for a beat, then writes the answer out word by word, like a person typing fast
  function respond(ans) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (off) {
      setLog((l) => [...l, { who: 'bot', ...ans }]);
      setSaid(ans.paras.join(' '));
      return;
    }
    setTyping(true);
    const n = words(ans.paras);
    timers.current.push(setTimeout(() => {
      setTyping(false);
      setShown(0);
      setLog((l) => [...l, { who: 'bot', ...ans }]);
      let k = 0;
      const step = () => {
        k = Math.min(n, k + 2);
        setShown(k);
        if (k < n) timers.current.push(setTimeout(step, 28));
        else { setShown(Infinity); setSaid(ans.paras.join(' ')); }
      };
      step();
    }, 450 + Math.min(500, n * 6)));
  }

  function ask(text, id) {
    const q = text.trim();
    if (!q || typing) return;
    const lastBot = [...log].reverse().find((m) => m.who === 'bot' && m.id);
    setLog((l) => [...l, { who: 'me', text: q }]);
    setDraft('');
    const r = id ? answerById(id) : reply(q, lastBot?.id);
    respond({ id: r.id, paras: r.paras, next: r.next, cta: r.cta });
  }

  function restart() {
    timers.current.forEach(clearTimeout);
    setTyping(false);
    setShown(Infinity);
    setLog([{ who: 'bot', paras: GREETING.a, next: STARTERS.map((id) => ({ id, q: questionFor(id) })) }]);
    input.current?.focus();
  }

  const lastIndex = log.length - 1;
  const panelId = `${uid}-panel`;

  // While an answer is being written out, show only its first `shown` words
  const visible = (m, i) => {
    if (i !== lastIndex || m.who !== 'bot' || shown === Infinity) return m.paras;
    let left = shown;
    const out = [];
    for (const p of m.paras) {
      if (left <= 0) break;
      const w = p.split(/\s+/);
      out.push(w.slice(0, left).join(' '));
      left -= w.length;
    }
    return out;
  };
  const writing = shown !== Infinity;

  return (
    <div className={`ask ${open ? 'is-open' : ''}`}>
      {open && (
        <section id={panelId} className="ask__panel" role="dialog" aria-modal="false" aria-labelledby={`${uid}-title`}>
          <header className="ask__head">
            <span className="ask__badge" aria-hidden="true"><Mark /></span>
            <div className="ask__titles">
              <h2 id={`${uid}-title`} className="ask__title">Ask Hydris</h2>
              <p className="ask__sub">Answers from this website. Nothing you type leaves the page.</p>
            </div>
            <button type="button" className="ask__icon" onClick={restart} aria-label="Start over" title="Start over">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10a6 6 0 1 0 1.8-4.3M4 3.5v3.2h3.2" /></svg>
            </button>
            <button type="button" className="ask__icon" onClick={close} aria-label="Close Ask Hydris">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
            </button>
          </header>

          <div className="ask__body" ref={body}>
            {log.map((m, i) => (
              <Fragment key={i}>
                {m.who === 'me'
                  ? <p className="ask__msg ask__msg--me">{m.text}</p>
                  : (
                    <div className="ask__msg ask__msg--bot">
                      <Answer paras={visible(m, i)} />
                      {m.cta && !(writing && i === lastIndex) && (
                        <a className="ask__cta" href={CTA.href}>{CTA.label} <Arrow /></a>
                      )}
                    </div>
                  )}
                {i === lastIndex && m.who === 'bot' && !writing && !typing && m.next?.length > 0 && (
                  <div className="ask__chips" role="group" aria-label="Suggested questions">
                    {m.next.map((n) => (
                      <button key={n.id} type="button" className="ask__chip" onClick={() => ask(n.q, n.id)}>{n.q}</button>
                    ))}
                  </div>
                )}
              </Fragment>
            ))}
            {typing && <p className="ask__msg ask__msg--bot ask__typing" aria-label="Ask Hydris is typing"><i /><i /><i /></p>}
          </div>
          <p className="sr-only" aria-live="polite">{said}</p>

          <form className="ask__form" onSubmit={(e) => { e.preventDefault(); ask(draft); }}>
            <label htmlFor={`${uid}-q`} className="sr-only">Your question</label>
            <input
              id={`${uid}-q`} ref={input} className="ask__input" value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about Hydris…" autoComplete="off" maxLength={300} enterKeyHint="send"
            />
            <button type="submit" className="ask__send" disabled={!draft.trim() || typing} aria-label="Send">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5.5L15.5 10 11 14.5" /></svg>
            </button>
          </form>
          <a className="ask__foot" href={CTA.href}>Prefer a person? {CTA.label} <Arrow /></a>
        </section>
      )}

      <button
        ref={launcher} type="button" className="ask__launch" aria-expanded={open} aria-controls={open ? panelId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="ask__badge" aria-hidden="true"><Mark /></span>
        <span className="ask__launch-label">{open ? 'Close' : 'Ask Hydris'}</span>
      </button>
    </div>
  );
}
