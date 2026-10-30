import { useId, useRef, useState } from 'react';
import { Reveal, SecHead, Words } from '../components/ui/Primitives.jsx';
import Icon, { Arrow } from '../components/ui/Icon.jsx';
import { CONTACT, FACILITIES } from '../lib/content.js';

const RULES = {
  name: (v) => (v.trim().length > 1 ? '' : 'Enter your name, so we know who to reply to.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a work email address, for example name@company.com.'),
  message: (v) => (v.trim().length > 9 ? '' : 'Tell us a little about your plant or your question (at least 10 characters).'),
};
const ORDER = ['name', 'email', 'message'];

const SUBJECT = {
  plant: (org) => `Request a walkthrough${org ? `: ${org}` : ''}`,
  press: () => 'Press enquiry',
  work: () => 'Working at Hydris',
};

/* A field that describes itself: the label, an optional hint and any error are all tied to the input */
function Field({ id, label, optional, hint, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}{optional ? <span className="mute"> (optional)</span> : <span className="field__req" aria-hidden="true"> *</span>}</label>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {children}
      <p className="field__err" id={`${id}-err`} role={error ? 'alert' : undefined}>{error}</p>
    </div>
  );
}

const described = (id, hint, error) => [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;

/* There is no form backend. The button prepares an email draft in the visitor's mail app, addressed by
   topic. Nothing is sent until they send it, and the page never claims otherwise. */
function ContactForm() {
  const uid = useId().replace(/:/g, '');
  const [v, setV] = useState({ topic: 'plant', name: '', email: '', org: '', industry: '', message: '' });
  const [err, setErr] = useState({});
  const [state, setState] = useState('idle'); // idle | opened | copied | copyfail
  const form = useRef(null);
  const route = CONTACT.routes.find((r) => r.key === v.topic);
  const set = (k) => (e) => {
    const val = e.target.value;
    setV((s) => ({ ...s, [k]: val }));
    if (err[k]) setErr((s) => ({ ...s, [k]: RULES[k](val) }));
    if (state !== 'idle') setState('idle');
  };
  const blur = (k) => () => RULES[k] && setErr((s) => ({ ...s, [k]: RULES[k](v[k]) }));

  const draft = () => {
    const subject = SUBJECT[v.topic](v.org);
    const body = [`Name: ${v.name}`, `Email: ${v.email}`, v.org && `Company: ${v.org}`, v.industry && `Sector: ${v.industry}`, '', v.message]
      .filter((l) => l !== false && l !== undefined && l !== null).join('\n');
    return { subject, body };
  };

  const validate = () => {
    const next = Object.fromEntries(ORDER.map((k) => [k, RULES[k](v[k])]));
    setErr(next);
    const first = ORDER.find((k) => next[k]);
    if (first) { form.current?.querySelector(`[name="${first}"]`)?.focus(); return false; }
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { subject, body } = draft();
    window.location.href = `mailto:${route.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setState('opened');
  };

  const copy = async () => {
    if (!validate()) return;
    const { subject, body } = draft();
    try {
      await navigator.clipboard.writeText(`To: ${route.email}\nSubject: ${subject}\n\n${body}`);
      setState('copied');
    } catch { setState('copyfail'); }
  };

  const status = {
    idle: '',
    opened: 'Your email app should now show a draft. It has not been sent: review it and press Send in your email app.',
    copied: `Copied. Paste it into an email to ${route.email} and send it from your own email app.`,
    copyfail: `Copying is not available in this browser. Write to ${route.email} directly.`,
  }[state];

  return (
    <form className="form" id="walkthrough" ref={form} noValidate onSubmit={submit} aria-labelledby={`${uid}-h`}>
      <h2 className="form__h t-s" id={`${uid}-h`}>Request a walkthrough</h2>
      <fieldset className="topics">
        <legend className="s-label">What is this about?</legend>
        <div className="topics__row">
          {CONTACT.routes.map((r) => (
            <label className={`topic ${v.topic === r.key ? 'is-on' : ''}`} key={r.key}>
              <input type="radio" name="topic" value={r.key} checked={v.topic === r.key} onChange={set('topic')} />
              <span>{r.pick}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field id={`${uid}-name`} label="Full name" error={err.name}>
        <input id={`${uid}-name`} name="name" autoComplete="name" required aria-required="true" value={v.name} onChange={set('name')} onBlur={blur('name')}
          aria-invalid={!!err.name} aria-describedby={described(`${uid}-name`, false, err.name)} />
      </Field>
      <Field id={`${uid}-email`} label="Work email" error={err.email}>
        <input id={`${uid}-email`} name="email" type="email" inputMode="email" autoComplete="email" required aria-required="true" value={v.email} onChange={set('email')} onBlur={blur('email')}
          aria-invalid={!!err.email} aria-describedby={described(`${uid}-email`, false, err.email)} />
      </Field>
      <div className="form__two">
        <Field id={`${uid}-org`} label="Company" optional>
          <input id={`${uid}-org`} name="org" autoComplete="organization" value={v.org} onChange={set('org')} />
        </Field>
        <Field id={`${uid}-industry`} label="Sector" optional>
          <select id={`${uid}-industry`} name="industry" value={v.industry} onChange={set('industry')}>
            <option value="">Select a sector</option>
            {FACILITIES.map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
      </div>
      <Field id={`${uid}-message`} label="How can we help?" hint={CONTACT.transfer} error={err.message}>
        <textarea id={`${uid}-message`} name="message" rows={5} required aria-required="true" value={v.message} onChange={set('message')} onBlur={blur('message')}
          aria-invalid={!!err.message} aria-describedby={described(`${uid}-message`, CONTACT.transfer, err.message)}
          placeholder="Tell us about your plant and what you would like to know." />
      </Field>
      <div className="form__foot">
        <button className="pill" type="submit">Open email draft <Arrow /></button>
        <button className="copy" type="button" onClick={copy}><Icon name={state === 'copied' ? 'check' : 'copy'} />Copy the request</button>
      </div>
      <p className="form__note">{`Opens a draft in your email app, addressed to ${route.email}. Nothing is sent until you send it.`}</p>
      <p className="form__status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}

export default function Contact() {
  return (
    <>
      <section className="phero phero--contact" aria-label="Contact">
        <div className="phero__inner grid">
          <div className="contact__intro">
            <Reveal as="p" className="s-label phero__label">(Contact) Hydris</Reveal>
            <Words as="h1" text={CONTACT.title} className="t-m contact__title" delay={0.1} />
            <Reveal as="p" className="lead contact__lead" delay={0.3}>{CONTACT.lead}</Reveal>
            <Reveal as="p" className="body mute contact__transfer" delay={0.4}>{CONTACT.transfer}</Reveal>
          </div>
          <Reveal className="contact__form" delay={0.2}><ContactForm /></Reveal>
        </div>
      </section>

      <section className="sec alt routes-sec" id="routes">
        <SecHead index="01" label="Other ways to reach us" title="Pick the route that fits." />
        <div className="routes grid">
          {CONTACT.routes.map((r, i) => (
            <Reveal className="route hl" key={r.key} delay={i * 0.08}>
              <span className="route__n">{String(i + 1).padStart(2, '0')}</span>
              <p className="s-label route__who">{r.who}</p>
              <h3 className="t-s">{r.title}</h3>
              <p className="body mute route__p">{r.text}</p>
              <a className="route__mail link-u" href={`mailto:${r.email}`}>{r.email} <Arrow /></a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec reach" id="details">
        <SecHead index="02" label="Details" title="Where to find us" />
        <dl className="details grid">
          {CONTACT.details.map((d, i) => (
            <Reveal className="detail hl" key={d.h} delay={i * 0.06}>
              <dt className="s-label">{d.h}</dt>
              <dd>
                {d.lines.map((l) => <span key={l}>{l}</span>)}
                {d.mail && <a className="link-u" href={`mailto:${d.mail}`}>{d.mail}</a>}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>
    </>
  );
}
