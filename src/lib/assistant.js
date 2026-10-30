/* Ask Hydris: the site's own chatbot. No API and no model service: every answer below is written from
   the website's copy (src/lib/content.js), and a small matcher in the visitor's browser picks the one
   that fits the question. Nothing typed into it leaves the page. When nothing fits well enough, it says
   so and points to a person.

   To teach it something new, add an entry to ANSWERS: `q` is the question as a visitor would ask it
   (also shown as a suggestion), `keys` are other words and phrasings that mean the same thing, `a` is
   the answer (one string per paragraph; "- " starts a bullet; [text](/path/) is a link), and `next`
   lists follow-up answers to suggest. */

import { CTA, EMAIL, EMAIL_PRESS, PHONE } from './content.js';

const WALK = `[${CTA.label}](${CTA.href})`;
const walk = `[request a walkthrough](${CTA.href})`;

export const ANSWERS = [
  {
    id: 'what',
    q: 'What is Hydris?',
    keys: ['what do you do', 'what does hydris do', 'tell me about hydris', 'explain hydris', 'overview', 'company', 'platform', 'intelligence layer', 'what is this'],
    a: [
      'Hydris is the operational intelligence layer for water. It combines scientific principles, operational data and human reasoning, so the people who run water systems can see what is changing and decide what to check next.',
      'It supports the people who run the plant. It does not replace them.',
    ],
    next: ['products', 'how', 'start'],
  },
  {
    id: 'how',
    q: 'How does it work?',
    keys: ['how it works', 'how does hydris work', 'workflow', 'see understand act', 'process', 'mechanism', 'approach'],
    a: [
      'One workflow in three steps, on one shared knowledge base:',
      '- See what is happening, with Hydris Lite.',
      '- Understand what it means, with Hydris Pulse.',
      '- Act with better guidance, with Hydris Field.',
      'Underneath sits a knowledge base built by our own water engineers, so Hydris arrives knowing how plants like yours behave, then learns what makes yours different. More on the [Platform](/platform/) page.',
    ],
    next: ['knowledge', 'products', 'demo'],
  },
  {
    id: 'products',
    q: 'What are the three products?',
    keys: ['products', 'product line', 'modules', 'offerings', 'lite pulse field', 'what do you sell', 'solutions', 'which product'],
    a: [
      'One platform, three products that share the same knowledge base and reasoning:',
      '- Hydris Lite, operational intelligence: a read on the plant every morning.',
      '- Hydris Pulse, expert reasoning: guided troubleshooting from a drifting reading to the next check.',
      '- Hydris Field, field execution: guidance and records on the round, hands free on smart glasses.',
      'Most plants start with Lite and add Pulse and Field when they are ready, with no second implementation.',
    ],
    next: ['lite', 'pulse', 'field'],
  },
  {
    id: 'lite',
    q: 'What does Hydris Lite do?',
    keys: ['lite', 'hydris lite', 'daily read', 'morning report', 'scores', 'plant intelligence page', 'operational intelligence', 'see', 'dashboard'],
    a: [
      'Hydris Lite captures and structures your plant\'s operating reality. It works from control system history, lab results, spreadsheets, procedures and shift logs, and gives the team a plant intelligence page every morning: a few clear scores and what needs attention.',
      'Nothing is connected to your controls. Try it on a sample plant in the [Lite demo](/demo/#lite).',
    ],
    next: ['pulse', 'data', 'demo'],
  },
  {
    id: 'pulse',
    q: 'What is Hydris Pulse?',
    keys: ['pulse', 'hydris pulse', 'troubleshooting', 'troubleshoot', 'diagnose', 'diagnosis', 'root cause', 'investigation', 'expert reasoning', 'recommendation', 'understand', 'why is it happening', 'alarm'],
    a: [
      'Hydris Pulse is guided troubleshooting. When a reading starts to drift, it opens an investigation: the likely causes ranked, the evidence behind each, and the next check to make. As the operator answers, the ranking updates. The operator decides.',
      'It works backwards to where a problem started, not where it shows, which is why it can buy your team days before a simple alarm would fire. Try it in the [Pulse demo](/demo/#pulse).',
    ],
    next: ['trust', 'field', 'demo'],
  },
  {
    id: 'field',
    q: 'What is Hydris Field?',
    keys: ['field', 'hydris field', 'smart glasses', 'glasses', 'hands free', 'wearable', 'rounds', 'checklist', 'field execution', 'technician', 'act', 'mobile', 'app'],
    a: [
      'Hydris Field puts the guidance in the operator\'s hands on the round, hands free on smart glasses: open a visit, take readings that are checked against limits, complete the checklist and submit the record. What happens in the field feeds back into what Hydris knows.',
      'The [Field demo](/demo/#field) shows the workflow in your browser.',
    ],
    next: ['pulse', 'demo', 'start'],
  },
  {
    id: 'knowledge',
    q: 'Where does the intelligence come from?',
    keys: ['knowledge base', 'expert knowledge', 'ai model', 'trained', 'training', 'machine learning', 'llm', 'chatgpt', 'how smart', 'engineers', 'ai'],
    a: [
      'From the Hydris curated expert knowledge base, built by our own water engineers: process engineering practice, treatment chemistry, equipment behaviour, operating procedure and field experience.',
      'Hydris does not learn your plant from scratch or guess from history. It is useful on day one, then learns what makes your plant different. Not a model left to guess, and not a chatbot with your manual attached.',
    ],
    next: ['trust', 'how', 'products'],
  },
  {
    id: 'trust',
    q: 'Can I check its answers?',
    keys: ['trust', 'explain', 'explainable', 'black box', 'reasoning', 'audit', 'auditable', 'accurate', 'accuracy', 'reliable', 'deterministic', 'wrong', 'hallucinate', 'overrule'],
    a: [
      'Yes. Every answer carries its reasoning and its source, so your engineer can agree or overrule it and your auditor can follow the trail.',
      'Where a rule is the right tool, Hydris uses a rule, so the same inputs give the same answer every time. Engineering logic sets the boundaries and the learning works inside them. If the data was thin, Hydris says so rather than pretending.',
    ],
    next: ['control', 'knowledge', 'security'],
  },
  {
    id: 'who',
    q: 'Who is Hydris for?',
    keys: ['who uses', 'who is it for', 'audience', 'customers', 'users', 'operators', 'plant manager', 'process engineer', 'executives', 'compliance', 'sustainability', 'for me', 'right for'],
    a: [
      'Hydris is built for the people who run water systems, wherever water is treated, reused or returned.',
      '- Operators know what deserves attention this morning, and what to do about it.',
      '- Plant managers see the plant as one system and know which problems are real.',
      '- Process engineers get the reasoning, not just the answer.',
      '- Compliance leads and executives get the evidence, and every site on the same basis.',
      'If it does not work for the person on shift at two in the morning, it does not work.',
    ],
    next: ['sectors', 'start', 'replace'],
  },
  {
    id: 'sectors',
    q: 'Which water systems does it work for?',
    keys: ['industries', 'industry', 'sectors', 'sector', 'municipal', 'utility', 'utilities', 'wastewater', 'drinking water', 'food and beverage', 'textiles', 'pulp and paper', 'chemicals', 'manufacturing', 'industrial', 'my plant type', 'treatment plant', 'reuse'],
    a: [
      'Hydris is for anyone who runs a water system, wherever water is treated, reused or returned. Today it starts with treatment plants in food and beverage, textiles, pulp and paper and chemicals.',
      `If you are not sure whether it fits your system, ask us. ${WALK} and if Hydris is not the right fit, we will tell you.`,
    ],
    next: ['proof', 'data', 'start'],
  },
  {
    id: 'data',
    q: 'What data do you need?',
    keys: ['data needed', 'inputs', 'integrations', 'integrate', 'scada', 'plc', 'dcs', 'historian', 'lab', 'laboratory', 'lims', 'excel', 'spreadsheets', 'logbook', 'shift logs', 'cmms', 'erp', 'iot', 'connect', 'compatible', 'existing systems', 'exports'],
    a: [
      'The exports your plant already produces: control system history, lab results, spreadsheets, procedures and operator logbooks. Thirty days is enough to begin.',
      'Hydris does not replace the systems you run, from SCADA and the lab to CMMS and ERP. It adds the intelligence layer on top. If your plant is already producing the data, we can already use it.',
    ],
    next: ['hardware', 'onboarding', 'security'],
  },
  {
    id: 'hardware',
    q: 'Do I need new sensors or hardware?',
    keys: ['sensors', 'sensor', 'meters', 'instrumentation', 'hardware', 'install', 'installation', 'equipment', 'capex', 'capital', 'devices', 'site visit'],
    a: [
      'No. Hydris runs on the instrumentation you already have. No new sensors or meters, no change to your control system and no capital expenditure. Nothing is installed at your site, and nobody visits with a toolbox.',
      'The plants running Hydris today did not buy a single sensor to work with us.',
    ],
    next: ['control', 'onboarding', 'pricing'],
  },
  {
    id: 'control',
    q: 'Will Hydris change anything in my plant?',
    keys: ['control my plant', 'automatic', 'automation', 'autonomous', 'write', 'setpoints', 'settings', 'safety', 'safe', 'take over', 'move equipment', 'read only', 'on its own'],
    a: [
      'Never on its own. Hydris only reads. It never writes to your control system and never moves equipment. Your operator stays the only one who changes a setting.',
    ],
    next: ['trust', 'replace', 'security'],
  },
  {
    id: 'replace',
    q: 'Does it replace operators?',
    keys: ['replace people', 'replace staff', 'jobs', 'headcount', 'automate operators', 'workforce', 'retire', 'retiring', 'retirement', 'succession', 'new operators', 'training operators', 'experience leaving'],
    a: [
      'No. Hydris scales judgement, it does not replace it. It captures how experienced operators reason and makes that available to whoever is on shift, so a newer operator has access to how an experienced one would think.',
      'Experience stops leaving with the people who hold it, and new operators become useful in months, not years.',
    ],
    next: ['technical', 'benefits', 'who'],
  },
  {
    id: 'technical',
    q: 'Do my operators need to be technical?',
    keys: ['technical', 'skills', 'easy to use', 'ease of use', 'learning curve', 'training required', 'it team', 'complicated', 'difficult to use', 'user friendly'],
    a: [
      'No. Hydris uses the language an operator already uses, and every answer shows its reasoning so anyone can check it. Nobody technical is needed on your side to run it.',
    ],
    next: ['onboarding', 'trust', 'demo'],
  },
  {
    id: 'onboarding',
    q: 'How long does it take to get started?',
    keys: ['how long', 'timeline', 'time to value', 'implementation', 'implement', 'deploy', 'deployment', 'setup', 'set up', 'onboard', 'onboarding', 'go live', 'weeks', 'difficult to put in', 'rollout'],
    a: [
      'Weeks, not quarters. It is a configuration exercise, not a capital project:',
      '- Week one: send thirty days of the exports your plant already produces.',
      '- Weeks two and three: we configure your plant with your team.',
      '- Go live: Lite starts producing a daily read.',
      '- When you are ready: add Pulse and Field, with no second implementation.',
    ],
    next: ['start', 'data', 'pricing'],
  },
  {
    id: 'start',
    q: 'How do I get started?',
    keys: ['get started', 'start', 'send data', 'send our data', 'send you data', 'next step', 'begin', 'sign up', 'buy', 'purchase', 'trial', 'pilot', 'proof of concept', 'poc', 'walkthrough', 'meeting', 'call', 'book', 'talk to sales', 'sales', 'interested'],
    a: [
      'Send us thirty days of your plant data and we will tell you what we see. No demo script and no obligation: we run your own data through the engine and walk you through what it says, including the parts that look fine.',
      `${WALK}, or write to ${EMAIL}. Please agree how plant data will be shared before you send any files.`,
    ],
    next: ['pricing', 'onboarding', 'demo'],
    cta: true,
  },
  {
    id: 'pricing',
    q: 'How much does it cost?',
    keys: ['price', 'pricing', 'cost', 'costs', 'how much', 'subscription', 'license', 'licence', 'fee', 'fees', 'budget', 'quote', 'commercials', 'contract', 'expensive', 'cheap', 'per site'],
    a: [
      'An annual subscription per site, with a one time setup. Multi site programmes are priced as a programme. There is no hardware to buy and no capital request.',
      `We give you the number on a call rather than making you guess from a page. ${WALK}.`,
    ],
    next: ['benefits', 'start', 'multisite'],
    cta: true,
  },
  {
    id: 'benefits',
    q: 'How would it improve my plant?',
    keys: ['benefits', 'benefit', 'value', 'roi', 'return on investment', 'savings', 'save money', 'reduce costs', 'chemicals', 'chemical dosing', 'energy', 'blowers', 'failures', 'downtime', 'compliance effort', 'permit', 'why should i', 'outcomes', 'impact'],
    a: [
      'By telling your team what is happening and what to do about it, every day. Most plants find the first value in what they stop doing: dosing and running equipment defensively.',
      '- Chemicals: dosing to the condition the plant is actually in.',
      '- Energy: running the blowers to what the plant needs today.',
      '- Avoided failures: seeing expensive problems days before an alarm.',
      '- Compliance: the evidence is already there when the auditor asks.',
      '- Time to competence: new operators become good faster.',
      'Your own numbers will differ, and we would rather work them out with you than guess.',
    ],
    next: ['proof', 'pricing', 'start'],
  },
  {
    id: 'proof',
    q: 'Is Hydris running in real plants?',
    keys: ['customers', 'case study', 'case studies', 'references', 'proof', 'results', 'deployed', 'in production', 'live', 'who uses it', 'clients', 'track record', 'evidence', 'litres', 'liters'],
    a: [
      'Yes. Hydris is live in operating treatment plants today, on the instrumentation those plants already had, with millions of litres of water under Hydris management every day.',
      `We are early, and we say so plainly. What we can show you is your own plant's data, read back to you, before you commit to anything. ${WALK}.`,
    ],
    next: ['start', 'benefits', 'demo'],
  },
  {
    id: 'security',
    q: 'Is my plant data secure?',
    keys: ['security', 'secure', 'data safe', 'my data', 'data secure', 'privacy', 'private', 'data protection', 'gdpr', 'tenant', 'single tenant', 'tenancy', 'cloud', 'hosting', 'on premise', 'on prem', 'soc 2', 'soc2', 'iso 27001', 'encryption', 'shared', 'pooled', 'who sees my data', 'cyber', 'ot security', 'it security'],
    a: [
      'Your plant\'s data lives in its own single tenancy. It is not pooled, not shared and not used to answer anyone else\'s question. What improves across plants is the understanding, not the data.',
      `IT and OT teams ask early and deserve a straight answer rather than a badge. Write to ${EMAIL} and we will tell you what is in place today and what is in progress.`,
    ],
    next: ['control', 'data', 'start'],
  },
  {
    id: 'multisite',
    q: 'Does it work across many sites?',
    keys: ['multiple sites', 'many sites', 'multi site', 'portfolio', 'enterprise', 'group', 'scale', 'scalable', 'fleet', 'hundred plants', 'compare sites', 'corporate', 'stewardship', 'suppliers', 'brand'],
    a: [
      'Yes. One plant or a hundred, on the same layer. Adding a site is a configuration exercise, not a new project.',
      'The same intelligence serves the operator on shift and the executive who answers for forty sites: compare every site on the same basis, and find the ones quietly at risk. Multi site programmes are priced as a programme.',
    ],
    next: ['pricing', 'start', 'who'],
  },
  {
    id: 'demo',
    q: 'Can I try a demo?',
    keys: ['demo', 'demos', 'try', 'try it', 'sample', 'example', 'see it', 'screenshots', 'preview', 'test drive', 'interactive'],
    a: [
      'Yes. Lite, Pulse and Field run in your browser on a sample plant on the [Demo](/demo/) page. Everything uses sample data, and nothing you enter leaves the page.',
      `To see it on your own plant, with your process and your questions, ${walk}.`,
    ],
    next: ['film', 'start', 'products'],
  },
  {
    id: 'film',
    q: 'Is there a video?',
    keys: ['video', 'film', 'watch', 'youtube', 'presentation', 'platform film'],
    a: [
      'Yes. The Hydris platform film runs about four minutes. Use "Watch the film" on the [Home](/) page.',
    ],
    next: ['demo', 'how', 'start'],
  },
  {
    id: 'whynow',
    q: 'Why could this not be built before?',
    keys: ['why now', 'what is new', 'different', 'difference', 'unique', 'competitors', 'competition', 'alternative', 'compared to', 'vs', 'versus', 'scada dashboard', 'existing software'],
    a: [
      'Water has been measured for two decades. What was missing was something that could reason about it the way an experienced operator does, and now something can.',
      'Hydris does not replace the systems a plant already runs on. Between the data a plant has and the decisions its operators make there was nothing, and that gap is the whole product. Not a dashboard to interrogate: guidance in the words an operator would use, with the reasoning attached.',
    ],
    next: ['knowledge', 'trust', 'products'],
  },
  {
    id: 'about',
    q: 'Who is behind Hydris?',
    keys: ['founder', 'founders', 'ceo', 'vetri', 'dhagumudi', 'team', 'leadership', 'who started', 'who founded', 'history', 'story', 'background', 'when founded'],
    a: [
      'Hydris was founded by people who spent their careers inside water operations, not adjacent to them. Vetri Dhagumudi is founder and chief executive, with nearly two decades in water engineering, plant operations and global water strategy.',
      'The team is water engineers, process specialists and software people working together. Read the full story on the [About](/about/) page.',
    ],
    next: ['where', 'careers', 'what'],
  },
  {
    id: 'where',
    q: 'Where are you based?',
    keys: ['location', 'locations', 'office', 'offices', 'headquarters', 'hq', 'based', 'portland', 'oregon', 'chennai', 'india', 'netherlands', 'amsterdam', 'usa', 'united states', 'europe', 'country', 'countries'],
    a: [
      'Hydris, Inc. is headquartered in Portland, Oregon, in the United States, with operations in Chennai, India. The team works across the United States, the Netherlands and India.',
    ],
    next: ['contact', 'about', 'careers'],
  },
  {
    id: 'contact',
    q: 'How do I contact Hydris?',
    keys: ['contact', 'email', 'e-mail', 'phone', 'telephone', 'call you', 'reach', 'speak to someone', 'human', 'person', 'support', 'help desk', 'address'],
    a: [
      `Write to ${EMAIL}, or call ${PHONE}. The [Contact](/contact/) page routes you to the right person rather than a queue.`,
      `If you run a plant, the quickest start is to ${walk}.`,
    ],
    next: ['start', 'press', 'careers'],
    cta: true,
  },
  {
    id: 'careers',
    q: 'Are you hiring?',
    keys: ['jobs', 'job', 'careers', 'career', 'hiring', 'work at hydris', 'work for', 'join', 'vacancies', 'openings', 'internship', 'apply', 'roles'],
    a: [
      `We are hiring engineers and water people. There is no jobs board yet. Write to ${EMAIL} with what you have built and what you want to work on.`,
    ],
    next: ['about', 'where', 'contact'],
  },
  {
    id: 'press',
    q: 'I am a journalist',
    keys: ['press', 'media', 'journalist', 'interview', 'article', 'news', 'boilerplate', 'logo', 'brand assets', 'press kit', 'bio'],
    a: [
      `Assets, boilerplate and bios are on the [Press](/press/) page, free to use, no form. Write to ${EMAIL_PRESS} and we respond within one business day.`,
    ],
    next: ['about', 'contact', 'what'],
  },
];

/* Conversation, not knowledge: greetings, thanks, and what this assistant is */
const SMALL = [
  { id: 'hello', keys: ['hi', 'hello', 'hey', 'hiya', 'good morning', 'good afternoon', 'good evening', 'greetings', 'yo'],
    a: ['Hello. I can answer questions about Hydris: the products, what a plant needs to get started, data and security, and how to reach the team. What would you like to know?'], next: ['what', 'start', 'demo'] },
  { id: 'thanks', keys: ['thanks', 'thank you', 'thx', 'cheers', 'great', 'perfect', 'helpful', 'ok', 'okay', 'cool', 'got it'],
    a: [`Glad that helped. If you would like to see Hydris on your own plant, ${walk}.`], next: ['start', 'demo', 'contact'] },
  { id: 'bye', keys: ['bye', 'goodbye', 'see you', 'later', 'that is all', 'nothing else'],
    a: [`Thanks for stopping by. You can always reach the team at ${EMAIL}.`], next: [] },
  { id: 'self', keys: ['who are you', 'are you a bot', 'are you human', 'are you ai', 'are you real', 'what are you', 'chatgpt', 'how do you work'],
    a: ['I am Ask Hydris, a guided assistant. My answers are written from this website and matched to your question here in your browser, so nothing you type is sent anywhere. For anything I cannot answer, a person at hello@hydris.ai can.'], next: ['what', 'contact'] },
];

export const STARTERS = ['what', 'start', 'pricing', 'security'];

export const GREETING = {
  a: ['Hi, I am Ask Hydris. I answer questions about Hydris from this website. Pick a question or type your own.'],
  next: STARTERS,
};

const FALLBACK = {
  a: [
    `I do not have a good answer for that one. The website does not cover it, and I would rather not guess.`,
    `A person can help: write to ${EMAIL}, or ${walk}.`,
  ],
  next: ['what', 'start', 'contact'],
  cta: true,
};

/* ---------------------------------------------------------------- matching */

const STOP = new Set(('a an the and or but if of to in on at for with from by about as is are was were be been being do does did doing ' +
  'i me my we our you your it its this that these those there here can could would should will shall may might must have has had ' +
  'what which who whom how when where why tell know please pls want need like get any some more much very just so also really ' +
  'hydris us am work works working').split(' '));

// Words that mean the same thing to a visitor; each maps to one canonical token
const SYNONYMS = {
  price: 'cost', pricing: 'cost', priced: 'cost', costs: 'cost', fee: 'cost', fees: 'cost', subscription: 'cost', licence: 'cost', license: 'cost', quote: 'cost', expensive: 'cost', cheap: 'cost', budget: 'cost',
  sensor: 'hardware', meter: 'hardware', instrument: 'hardware', instrumentation: 'hardware', device: 'hardware', equipment: 'hardware', install: 'hardware', installation: 'hardware', capex: 'hardware',
  plc: 'scada', dcs: 'scada', historian: 'scada', osisoft: 'scada', pi: 'scada', hmi: 'scada',
  secure: 'security', safety: 'safe', privacy: 'security', private: 'security', encryption: 'security', tenancy: 'tenant', gdpr: 'security', cyber: 'security',
  glass: 'glasses', wearable: 'glasses', headset: 'glasses', handsfree: 'glasses',
  troubleshoot: 'diagnose', troubleshooting: 'diagnose', diagnosis: 'diagnose', rootcause: 'diagnose', investigate: 'diagnose', investigation: 'diagnose',
  deploy: 'onboard', deployment: 'onboard', implement: 'onboard', implementation: 'onboard', setup: 'onboard', rollout: 'onboard', onboarding: 'onboard',
  job: 'career', jobs: 'career', hiring: 'career', vacancy: 'career', vacancies: 'career', careers: 'career', internship: 'career',
  journalist: 'press', media: 'press', reporter: 'press',
  email: 'contact', phone: 'contact', telephone: 'contact', reach: 'contact',
  municipal: 'sector', utility: 'sector', utilities: 'sector', industry: 'sector', industries: 'sector', sectors: 'sector', vertical: 'sector', verticals: 'sector',
  site: 'site', sites: 'site', plants: 'plant', facility: 'plant', facilities: 'plant',
  video: 'film', movie: 'film',
  ai: 'ai', llm: 'ai', ml: 'ai', gpt: 'ai', chatgpt: 'ai', model: 'ai',
  founder: 'founder', ceo: 'founder', founders: 'founder', cofounder: 'founder',
  office: 'location', offices: 'location', hq: 'location', headquarters: 'location', based: 'location', located: 'location',
};

const stem = (w) => {
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && w.endsWith('es') && !w.endsWith('ses')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  if (w.length > 5 && w.endsWith('ed')) return w.slice(0, -2);
  return w;
};

export function tokens(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => SYNONYMS[w] || SYNONYMS[stem(w)] || stem(w));
}

const norm = (text) => ` ${text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;

const ALL = [...ANSWERS, ...SMALL];
const BY_ID = Object.fromEntries(ALL.map((e) => [e.id, e]));

// Each entry's vocabulary: its question and its keys, weighted by how rare each word is across entries
const DOCS = ALL.map((e) => {
  const words = new Map();
  for (const t of tokens([e.q || '', ...e.keys].join(' '))) words.set(t, (words.get(t) || 0) + 1);
  return { e, words, phrases: e.keys.filter((k) => k.includes(' ')).map(norm) };
});
const DF = new Map();
for (const d of DOCS) for (const t of d.words.keys()) DF.set(t, (DF.get(t) || 0) + 1);
const idf = (t) => Math.log(1 + DOCS.length / (DF.get(t) || DOCS.length));

function score(d, qTokens, qNorm) {
  let s = 0;
  for (const t of qTokens) if (d.words.has(t)) s += idf(t) * (1 + Math.log(d.words.get(t)));
  // A whole phrase from the keys (or the question itself) is strong evidence
  for (const p of d.phrases) if (qNorm.includes(p)) s += 2.5;
  if (d.e.q && qNorm.includes(norm(d.e.q).trim())) s += 4;
  // Single short words such as "hi" or "thanks" only count when they are the whole message
  if (!d.e.q && d.e.keys.some((k) => qNorm.trim() === k)) s += 6;
  return s;
}

const pack = (entry, extra = {}) => ({
  id: entry.id,
  paras: entry.a,
  next: (entry.next || []).map((id) => BY_ID[id]).filter((x) => x && x.q).map((x) => ({ id: x.id, q: x.q })),
  cta: !!entry.cta,
  ...extra,
});

export const questionFor = (id) => BY_ID[id]?.q || '';

export function answerById(id) {
  const e = BY_ID[id];
  return e ? pack(e) : pack(FALLBACK, { id: 'fallback' });
}

/* The reply to a typed question: the best match if it is clear enough, otherwise an honest fallback */
export function reply(text, lastId) {
  const qNorm = norm(text);
  const qTokens = tokens(text);
  if (!qTokens.length && !qNorm.trim()) return pack(FALLBACK, { id: 'fallback' });

  const ranked = DOCS.map((d) => ({ e: d.e, s: score(d, qTokens, qNorm) })).sort((a, b) => b.s - a.s);
  const [best, second] = ranked;

  // A short follow-up ("and the price?", "how long?") leans toward what was just discussed
  if (lastId && qTokens.length <= 2 && best.s < 2.2) {
    const follow = BY_ID[lastId]?.next?.map((id) => ranked.find((r) => r.e.id === id)).filter(Boolean).sort((a, b) => b.s - a.s)[0];
    if (follow && follow.s > 0.8) return pack(follow.e);
  }

  if (best.s < 1.6) return pack(FALLBACK, { id: 'fallback' });
  const out = pack(best.e);
  // When a second answer is nearly as good, offer it first among the follow-ups
  if (second && second.e.q && second.s > best.s * 0.8 && second.e.id !== best.e.id) {
    out.next = [{ id: second.e.id, q: second.e.q }, ...out.next.filter((n) => n.id !== second.e.id)].slice(0, 3);
  }
  return out;
}
