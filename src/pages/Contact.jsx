import { useState } from 'react';
import Magnet from '../components/reactbits/Magnet/Magnet.jsx';
import SpotlightCard from '../components/reactbits/SpotlightCard/SpotlightCard.jsx';
import { Dots } from '../components/sections/Blocks.jsx';
import { Band } from '../components/sections/Imagery.jsx';
import Icon from '../components/ui/Icon.jsx';
import { Arrow, Reveal, SecHead, Words } from '../components/ui/Primitives.jsx';
import { CONTACT, FACILITIES, IMAGERY } from '../lib/content.js';

const RULES = {
  name: (v) => (v.trim().length > 1 ? '' : 'Please enter your name.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid e-mail address.'),
  message: (v) => (v.trim().length > 9 ? '' : 'Please tell us a little more (at least 10 characters).'),
};

const SUBJECT = {
  plant: (org) => `Thirty days of data${org ? `: ${org}` : ''}`,
  press: () => 'Press enquiry',
  work: () => 'Working at Hydris',
};

function Field({ id, label, optional, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}{optional && <span className="mute"> (optional)</span>}</label>
      {children}
      <span className="field__err" aria-live="polite">{error}</span>
    </div>
  );
}

/* The topic decides who receives it: plant and careers go to hello@, press to press@ */
function ContactForm() {
  const [v, setV] = useState({ topic: 'plant', name: '', email: '', org: '', industry: '', message: '' });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const route = CONTACT.routes.find((r) => r.key === v.topic);
  const set = (k) => (e) => {
    const val = e.target.value;
    setV((s) => ({ ...s, [k]: val }));
    if (err[k]) setErr((s) => ({ ...s, [k]: RULES[k](val) }));
  };
  const blur = (k) => () => RULES[k] && setErr((s) => ({ ...s, [k]: RULES[k](v[k]) }));

  const submit = (e) => {
    e.preventDefault();
    const next = Object.fromEntries(Object.keys(RULES).map((k) => [k, RULES[k](v[k])]));
    setErr(next);
    const first = Object.keys(next).find((k) => next[k]);
    if (first) { document.getElementById(`f-${first}`)?.focus(); return; }
    const subject = SUBJECT[v.topic](v.org);
    const body = [`Name: ${v.name}`, `E-mail: ${v.email}`, v.org && `Organization: ${v.org}`, v.industry && `Industry: ${v.industry}`, '', v.message]
      .filter((l) => l !== false && l !== undefined && l !== null).join('\n');
    window.location.href = `mailto:${route.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="form" noValidate onSubmit={submit}>
      <p className="form__h">Write to us</p>
      <fieldset className="topics">
        <legend className="sr-only">What is this about?</legend>
        {CONTACT.routes.map((r) => (
          <label className={`topic ${v.topic === r.key ? 'is-on' : ''}`} key={r.key}>
            <input type="radio" name="topic" value={r.key} checked={v.topic === r.key} onChange={set('topic')} />
            <span>{r.pick}</span>
          </label>
        ))}
      </fieldset>
      <Field id="f-name" label="Full name" error={err.name}>
        <input id="f-name" autoComplete="name" value={v.name} onChange={set('name')} onBlur={blur('name')} aria-invalid={!!err.name} />
      </Field>
      <Field id="f-email" label="Work e-mail" error={err.email}>
        <input id="f-email" type="email" inputMode="email" autoComplete="email" value={v.email} onChange={set('email')} onBlur={blur('email')} aria-invalid={!!err.email} />
      </Field>
      <Field id="f-org" label="Company" optional>
        <input id="f-org" autoComplete="organization" value={v.org} onChange={set('org')} />
      </Field>
      <Field id="f-industry" label="Industry" optional>
        <select id="f-industry" value={v.industry} onChange={set('industry')}>
          <option value="">Select an industry</option>
          {FACILITIES.map((f) => <option key={f}>{f}</option>)}
        </select>
      </Field>
      <Field id="f-message" label="How can we help?" error={err.message}>
        <textarea id="f-message" rows={4} value={v.message} onChange={set('message')} onBlur={blur('message')} aria-invalid={!!err.message}
          placeholder="Tell us about your plant and what you would like to know." />
      </Field>
      <div className="form__foot">
        <p className="form__note" aria-live="polite">
          {sent ? `Your e-mail app should now be open with your message ready to send. Nothing opened? Write to ${route.email}.` : `Sending opens your e-mail app, addressed to ${route.email}.`}
        </p>
        <Magnet padding={60} magnetStrength={4}>
          <button className="pill" type="submit">Send message <Arrow /></button>
        </Magnet>
      </div>
    </form>
  );
}

export default function Contact() {
  return (
    <>
      <section className="phero phero--short">
        <Dots className="dots--right" />
        <div className="phero__inner grid">
          <Reveal as="p" className="s-label phero__label">(Contact) Hydris</Reveal>
          <Words as="h1" text={CONTACT.title} className="t-m contact__title" delay={0.1} />
          <Reveal as="p" className="lead phero__lead" delay={0.5}>{CONTACT.lead}</Reveal>
        </div>
      </section>

      <section className="sec routes-sec">
        <div className="routes">
          {CONTACT.routes.map((r, i) => (
            <Reveal className="routes__cell" key={r.key} delay={i * 0.1}>
              <SpotlightCard className="route" spotlightColor="rgba(0, 0, 0, 0.08)">
                <span className="route__n">{String(i + 1).padStart(2, '0')}</span>
                <p className="s-label route__who">{r.who}</p>
                <h3 className="t-s">{r.title}</h3>
                <p className="body mute route__p">{r.text}</p>
                <a className="route__mail link-u" href={`mailto:${r.email}`}>{r.email} <Arrow /></a>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <Band {...IMAGERY.bands.contact} />

      <section className="sec alt reach" id="write">
        <SecHead index="01" label="Details" title="Where to find us" />
        <div className="reach__grid grid">
          <dl className="details">
            {CONTACT.details.map((d, i) => (
              <Reveal className="detail hl" key={d.h} delay={i * 0.07}>
                <dt className="s-label">{d.h}</dt>
                <dd>
                  {d.lines.map((l) => <span key={l}>{l}</span>)}
                  {d.mail && <a className="link-u" href={`mailto:${d.mail}`}>{d.mail}</a>}
                </dd>
              </Reveal>
            ))}
          </dl>
          <Reveal className="reach__form" delay={0.15}><ContactForm /></Reveal>
        </div>
      </section>
    </>
  );
}
