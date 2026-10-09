// All site copy in one place. Source of truth: hydris-site-v16.html. Brand rule: never use em-dashes.

export const EMAIL = 'hello@hydris.ai';
export const EMAIL_PRESS = 'press@hydris.ai';
export const EMAIL_OPS = 'operations@hydris.ai';
export const EMAIL_PRIVACY = 'privacy@hydris.ai';
export const EMAIL_LEGAL = 'legal@hydris.ai';
export const PHONE = '+1 (503) 442-7560';

export const NAV = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'platform', label: 'Platform', href: '/platform/' },
  { key: 'about', label: 'About', href: '/about/' },
  { key: 'press', label: 'Press', href: '/press/' },
];

/* ---------------------------------------------------------------- Home */

export const HERO = {
  eyebrow: 'The operational intelligence layer for water',
  title: 'Water has digitised the plant. Hydris is digitising how the plant thinks.',
  sub: 'Two decades of instrumentation gave industry a plant it can watch. It did not give industry a plant that can reason. Hydris turns the water data you already collect into decisions your team can act on, and turns the judgement that lives in a few heads into something the whole operation can use.',
};

export const SHIFTS = [
  { from: 'From data', to: 'To decisions' },
  { from: 'From tribal knowledge', to: 'To institutional intelligence' },
  { from: 'From watching the plant', to: 'To understanding it' },
];

export const GET_IN = {
  title: 'Get Hydris in your plant.',
  lead: 'There is very little standing between you and this. That is deliberate.',
  items: [
    { icon: 'nocap', title: 'No capital expenditure', text: 'Nothing to procure, nothing to depreciate, no business case to defend.' },
    { icon: 'nosensor', title: 'No new sensors or meters', text: 'Your instrumentation stays exactly as it is. So does your control system.' },
    { icon: 'stack', title: 'Works with what you already have', text: 'If your plant is already producing the data, we can already use it.' },
    { icon: 'weeks', title: 'Onboarding measured in weeks', text: 'A configuration exercise with your team, not a deployment project.' },
  ],
};

export const SYSTEMS = ['Operators', 'Lab', 'Excel', 'SCADA', 'IoT', 'CMMS', 'ERP', 'Control system history', 'Procedures', 'Shift logs'];

export const PROBLEM = {
  eyebrow: 'The problem',
  title: 'Industrial water got digitised. It did not get intelligent.',
  lede: 'Your plant has more data than it has ever had. Control system history, lab results, spreadsheets, procedures, shift logs. None of it tells an operator at two in the morning why the plant is behaving this way and what to do about it.',
  points: [
    {
      title: 'The operators are skilled. The system is blind.',
      text: 'This is not a criticism of your team. The tools they were given were built to watch individual numbers against individual limits. Every reading can sit inside its limit while the plant is quietly heading somewhere it should not go, and no threshold alarm is designed to see that.',
    },
    {
      title: 'The knowledge that runs a plant is walking out of the door.',
      text: 'The person who can read the whole plant at a glance, the engineer who has seen this before and knows what it turned into last time, visits once a month or is a few years from retiring. That judgement is not in the manuals. It is in one head, and nobody is writing it down.',
    },
  ],
  close: 'Measurement was never the constraint. Expertise is.',
};

export const CATEGORY = {
  eyebrow: 'The category',
  title: 'Operational Water Intelligence',
  term: 'Definition',
  d1: 'The layer between the water a plant measures and the decisions its people make.',
  d2: [
    'Monitoring tells you what happened. Analytics tells you what happened, more precisely. Neither tells you what to do, because that has always taken judgement, and judgement has only ever lived in people.',
    'Operational Water Intelligence is that judgement, captured and made available to whoever is on shift. It is what AI is finally good enough to carry, and it is why this category can exist now and could not five years ago.',
  ],
  nots: [
    { x: 'Monitoring.', y: 'More numbers on a screen is the problem, not the answer.' },
    { x: 'A sustainability dashboard.', y: 'This is an operations tool that happens to produce a better environmental outcome.' },
    { x: 'A black box.', y: 'An answer nobody can question has no place in a plant you are accountable for.' },
    { x: 'Automation.', y: 'Hydris never touches your controls. Your operator remains the only person who changes anything.' },
  ],
};

export const HOW = {
  eyebrow: 'How it works',
  title: 'Five steps, running every day, on the plant you already have.',
  lead: 'Nothing new to install. The loop starts with what your plant already produces and ends with the plant knowing more than it did yesterday.',
  steps: [
    { key: 'Data', title: 'Everything the plant knows', text: 'Control system history, lab results, spreadsheets, procedures, shift logs and what the operator saw, brought into one place.', widget: 'data' },
    { key: 'Understand', title: 'Context, not just values', text: 'What this plant is, what it is making this week, and what normal actually looks like here rather than in a textbook.', widget: 'understand' },
    { key: 'Reason', title: 'Why, traced to the source', text: 'Hydris works backwards to where the problem started rather than stopping at the place it happens to show.', widget: 'reason' },
    { key: 'Act', title: 'The next step, in their hands', text: 'A clear recommendation in the words an operator already uses, with the reasoning attached so it can be checked or overruled.', widget: 'act' },
    { key: 'Learn', title: 'The plant gets better at itself', text: 'What was decided and what happened next goes back in, so the intelligence sharpens on your plant instead of staying frozen at install.', widget: 'learn' },
  ],
  result: ['Fewer surprises', 'Lower operating cost', 'Knowledge that stays with the plant'],
};

export const KNOWLEDGE = {
  eyebrow: 'What it runs on',
  title: 'Powered by the Hydris curated expert knowledge base.',
  lead: 'Decades of water operating expertise, structured so a machine can use it.',
  text: 'Hydris does not learn your plant from scratch and it does not guess from history. Underneath the product sits a knowledge base built and curated by our own water engineers: process engineering practice, treatment chemistry, equipment behaviour, operating procedure and the field experience that usually never leaves the people who hold it.',
  text2: 'That is why Hydris is useful on day one rather than after a year of watching. It arrives already knowing how plants like yours behave, then learns what makes yours different.',
  not: 'Not a model left to guess from history. Not a chatbot with your manual attached.',
  layers: ['Process engineering practice', 'Treatment chemistry', 'Equipment behaviour', 'Operating procedure', 'Field experience'],
};

export const WHY = {
  eyebrow: 'Why Hydris',
  title: 'Three things we hold to, whatever it costs us.',
  lead: 'These are not features. They are the constraints we designed inside, and they are the reasons a process safety team and an operator can both say yes to the same tool.',
  items: [
    { icon: 'shield', title: 'Explainable, always', text: 'Every answer carries its reasoning and its source. Your engineer can agree with it or overrule it, and your auditor can follow it. Nothing is ever asked to be taken on trust.' },
    { icon: 'hand', title: 'Your operator stays in control', text: 'Hydris only reads. It does not write to your control system and it cannot move equipment. The only thing that changes a setting in your plant is still a person who decided to.' },
    { icon: 'trend', title: 'It gets better with time', text: 'Every plant makes the layer sharper, so what you have in three years is not what you bought this year. Very little software in this industry can say that.' },
  ],
};

export const PRODUCTS = [
  { icon: 'lite', name: 'Hydris Lite', role: 'Operational intelligence', text: "Capture and structure every plant's operating reality.", verbs: ['Configure', 'Score', 'Standardise'] },
  { icon: 'pulse', name: 'Hydris Pulse', role: 'Expert reasoning', text: 'Turn that reality into expert decisions.', verbs: ['Diagnose', 'Recommend', 'Predict'] },
  { icon: 'field', name: 'Hydris Field', role: 'Field execution', text: "Put intelligence in the operator's hands, hands free on smart glasses, and learn from what happens.", verbs: ['Guide', 'Execute', 'Feed back'] },
];

export const PLATFORM_HOME = {
  eyebrow: 'The platform',
  title: 'One platform. Three products.',
  lead: 'Each one makes the next one smarter. Start with any of them.',
};

export const LOOP = {
  label: 'Continuous learning loop',
  text: "What Field executes becomes tomorrow's intelligence.",
  one: ['Not three products. ', 'One platform that compounds: every deployment makes the whole system smarter.'],
};

export const IMPL = {
  eyebrow: 'How you get it in',
  title: 'A configuration exercise, not a capital project.',
  lead: 'Nothing is installed at your site. Nobody visits with a toolbox. There is no procurement cycle for hardware, because there is no hardware.',
  steps: [
    { when: 'Week one', title: 'Send what you already have', text: 'Thirty days of the exports your plant already produces. Control system history, lab results, spreadsheets, procedures, logbooks. Nothing new to collect.' },
    { when: 'Weeks two and three', title: 'We configure your plant with your team', text: "Your layout, your chemistry, your operating rules and your team's judgement mapped into the knowledge base. We do this with your people, not at them, because what we are capturing is theirs." },
    { when: 'Go live', title: 'Lite starts producing a daily read', text: 'Your operators get a plant intelligence page every morning. Nothing connected to your controls, nothing that can change a setting.' },
    { when: 'When you are ready', title: 'Add Pulse and Field', text: 'Same layer, same knowledge, no second implementation. Adding a product is a switch, and adding a site is a repeat of the same weeks.' },
  ],
  close: ['No capital request. No new instrumentation. No change to your control system. ', 'The only thing your plant has to give us is data it is already producing.'],
};

export const PROOF = {
  eyebrow: 'Where we are today',
  title: 'Running in operating plants, not in a lab.',
  lead: 'Hydris is live in industrial treatment plants right now, working from the instrumentation those plants already had. Not one of them bought a sensor to work with us.',
  big: 'Millions of litres',
  unit: 'of industrial water under Hydris management every day',
  note: 'We are early, and we would rather say that plainly than dress it up. What we can show you is not a case study about somebody else. It is your own plant\'s data, read back to you, before you commit to anything.',
};

export const LOOKS = {
  eyebrow: 'What it looks like',
  title: 'A read on the plant, before the shift starts.',
  lead: 'Not a dashboard to interrogate. Guidance, in the words an operator would use, with the reasoning attached.',
  head: ['Plant 01', 'Night shift', '02:14'],
  rows: [
    { p: 'pH', v: '7.1', s: 'stable' },
    { p: 'Oxygen', v: '4.2', s: 'stable' },
    { p: 'Biomass', v: '3 480', s: 'drifting 6h', alert: true },
    { p: 'Discharge quality', v: '118', s: 'stable' },
    { p: 'Flow', v: '212', s: 'stable' },
  ],
  note: [
    ['This has been climbing since the ', false],
    ['18:40 feed change', true],
    ['. The same pattern preceded a settling problem on ', false],
    ['14 March', true],
    ['. The fix then was to reduce, not increase. ', false],
    ['Check the return rate before touching the blowers.', true],
  ],
  alt: 'Example plant readout at two fourteen in the morning. Four readings shown as stable and one drifting for six hours. Hydris Pulse notes that the drift began after an evening feed change, that the same pattern preceded a settling problem in March, that the response then was to reduce rather than increase, and suggests checking the return rate before adjusting the blowers.',
  caption: 'Illustrative. Not live plant data.',
  copy: [
    'That is one operator, on one night, with twenty five years of plant history standing behind them.',
    'Hydris does not raise an alarm and leave. It says what it thinks is happening, why it thinks so, and what happened the last time the plant did this. Then it gets out of the way, because the operator is the one who decides.',
    'Every answer shows its reasoning. If we cannot explain it, we do not ship it.',
  ],
};

export const MATTERS = {
  eyebrow: 'Why it matters',
  title: 'What changes when a plant can think.',
  principles: [
    { title: 'Cost', text: 'Plants run cautiously because caution is safer than being wrong. Knowing what is actually happening lets a team run the plant to its condition rather than to the worst case, and that is where the money has always been.' },
    { title: 'Risk', text: 'Most expensive failures announce themselves quietly, days before anything alarms. Seeing them early is the difference between an adjustment and an incident.' },
    { title: 'Knowledge', text: 'Experience stops leaving with the people who hold it. New operators become useful in months rather than years, and the plant keeps what it has learned.' },
  ],
  levers: [
    { title: 'Chemicals', where: 'Largest controllable operating cost', text: 'Dosing to the condition the plant is actually in, rather than the condition it might be in.' },
    { title: 'Energy', where: 'The biggest electrical load', text: 'Running the blowers to what the plant needs today rather than to a setting nobody has revisited.' },
    { title: 'Avoided failures', where: 'The cost nobody budgets for', text: 'An upset that halts production, equipment replaced early, one discharge outside permit.' },
    { title: 'Compliance effort', where: 'Engineer hours, not line items', text: 'A plant that records what it did and why already has the evidence when the auditor asks.' },
    { title: 'Time to competence', where: 'The one that compounds', text: 'Shorten how long a new operator takes to become good, and every line above improves with it.' },
  ],
  note: 'Your own numbers will differ, and we would rather work them out with you than put someone else\'s on a web page.',
  strong: 'Hydris runs on the instrumentation you already have. No new sensors, no capital project, an annual subscription per site.',
};

export const MISSING = {
  eyebrow: 'The missing layer',
  title: 'We do not replace the systems a plant already runs on. We add the intelligence layer on top.',
  lead: 'Between the data a plant already has and the decisions its operators have to make, there is nothing. That gap is the whole product.',
  // top to bottom
  stack: [
    { name: 'Enterprise intelligence', role: 'The group', kind: 'top' },
    { name: 'Portfolio intelligence', role: 'Every site, one basis', kind: 'top' },
    { name: 'Site intelligence', role: 'The plant as one system', kind: 'top' },
    { name: 'Hydris Field', role: 'Field execution', kind: 'hy' },
    { name: 'Hydris Pulse', role: 'Expert reasoning', kind: 'hy' },
    { name: 'Hydris Lite', role: 'Operational intelligence', kind: 'hy' },
    { name: 'The systems you already run', role: 'Operators · Lab · Excel · SCADA · IoT · CMMS · ERP', kind: 'base' },
  ],
  note: 'Data at the base compounds into progressively higher-order intelligence.',
  foot: "Your plant's data never leaves your tenancy. What travels is the understanding, not the data.",
};

export const AUDIENCE = {
  eyebrow: 'Who it is for',
  title: 'Built for operators. Valued by everyone above them.',
  lead: 'If it does not work for the person on shift at two in the morning, it does not work. Everything else follows from that.',
  rows: [
    { icon: 'operator', title: 'Operators', text: 'Know what deserves attention this morning and what to do about it, without waiting for someone senior to be free.' },
    { icon: 'manager', title: 'Plant managers', text: 'See the plant as one system rather than a wall of separate numbers, and know which problems are real before they become expensive.' },
    { icon: 'engineer', title: 'Process engineers', text: 'Get the reasoning, not just the answer, and can agree with it or overrule it on the evidence.' },
    { icon: 'leaf', title: 'Sustainability and compliance leads', text: 'Have the evidence already assembled when a customer, a brand programme or a regulator asks, because it was recorded as the work happened.' },
    { icon: 'bars', title: 'Operations executives', text: 'Compare every site on the same basis, find the ones quietly at risk, and see where the cost actually sits across the portfolio.' },
  ],
  verticals: ['Food and beverage', 'Textiles', 'Pulp and paper', 'Chemicals'],
  note: 'Hydris is built for industrial operations, not municipal utility billing. Industrial plants change what they make, and the water system has to follow.',
};

export const HOME_FAQ = [
  ['How would this improve my plant?',
    'By telling your team what is happening and what to do about it, every day, instead of leaving them to work it out from a wall of numbers. Most plants find the first value in what they stop doing, which is dosing and running equipment defensively because nobody is certain what the plant actually needs.'],
  ['Is it difficult to put in?',
    'No, and this is the part people expect to be worse than it is. There is no hardware, no change to your control system and no capital request. We work from exports you already produce, so getting started is a configuration exercise measured in weeks rather than a project measured in quarters.'],
  ['Where does the intelligence come from?',
    'From the Hydris curated expert knowledge base: process engineering practice, treatment chemistry, equipment behaviour and operating experience, structured by our own water engineers so the system can reason with it. It arrives knowing how plants like yours behave, then learns what makes yours different.'],
  ['Do my operators need to be technical?',
    'No. Hydris talks in the language an operator already uses, and every answer comes with the reasoning behind it so anyone can check it rather than take it on trust. If a recommendation cannot be acted on before the end of a shift, we do not consider it finished.'],
  ['Will Hydris change anything in my plant on its own?',
    'Never. Hydris only reads. It does not write to your control system and it does not move equipment. Your operator stays the only thing that changes a setting, which is how it should be and how your process safety people will want it.'],
  ['What happens to my plant\'s data?',
    'It stays in your own single tenancy and it is not pooled with anyone else\'s. What improves across plants is the understanding, not the data. Your IT team will ask about this early and deserves a straight answer rather than a badge, so write to us and we will tell you what is in place today and what is in progress.'],
];

export const NOTE = {
  title: 'The monthly note',
  text: 'One email a month on what we are learning about industrial water operations, written for people who run plants. No product news, no sales sequence, unsubscribe in one click.',
};

export const START = {
  eyebrow: 'Start here',
  title: 'Send us thirty days of your plant data. We will tell you what we see.',
  text: 'No demo script and no obligation. We run your own data through the engine and walk you through what it says about your plant, including the parts that look fine.',
  textShort: 'We run your own data through the engine and walk you through what it says, including the parts that look fine.',
};

/* ------------------------------------------------------------ Platform */

export const PLATFORM = {
  title: 'Why this could not be built five years ago.',
  lead: 'Not because the water was not measured. It has been measured for two decades. Because nothing could reason about it the way an experienced operator does, and now something can.',
  bet: {
    eyebrow: 'The bet',
    title: 'Expertise is the constraint. AI is the first thing capable of carrying it.',
    term: 'What the AI is for',
    d1: 'Scaling judgement, not replacing it.',
    d2: [
      'The scarce thing in industrial water is not data and it is not equipment. It is the number of people who can look at a plant and know what it is about to do. Those people are retiring faster than the industry can replace them, and until now nobody could copy what they know.',
      'Hydris captures how they reason and applies it to a plant every day. Not a model left to guess from history, and not a chatbot with a manual attached. Structured judgement, running continuously, on your water.',
    ],
  },
  products: {
    eyebrow: 'The products',
    title: 'One platform. Three products.',
    lead: 'They share the same knowledge base and the same reasoning, so each one makes the next one smarter.',
  },
  tech: {
    eyebrow: 'The technology',
    title: 'Built the way a plant you are accountable for requires.',
    lead: 'These are architecture decisions, not features. They are the reasons a process safety team and an IT team can both say yes.',
    items: [
      { icon: 'chip', title: 'Deterministic first', text: 'Where a rule is the right tool, Hydris uses a rule. The same inputs give the same answer every time, because an answer that changes when nothing did has no place in an operating plant.' },
      { icon: 'scale', title: 'Deterministic and probabilistic together', text: 'Engineering logic sets the boundaries and the learning works inside them. Rules where rules are right, learning where learning is right, and never the other way round.' },
      { icon: 'shield', title: 'Auditable by design', text: 'Every answer carries its reasoning and its source. Your engineer can agree or overrule it, your auditor can follow the trail, and nobody is asked to take anything on trust.' },
      { icon: 'lock', title: 'Secure and single tenant', text: 'Your plant\'s data lives in its own tenancy. It is not pooled, not shared and not used to answer anyone else\'s question.' },
      { icon: 'layers', title: 'Scalable architecture', text: 'One plant or a hundred, on the same layer. Adding a site is a configuration exercise, not a new project.' },
    ],
  },
  gets: {
    eyebrow: 'What you get',
    title: 'Three questions, answered every morning.',
    lead: 'Three plain answers, and the reasoning behind each one if you want it.',
    rows: [
      { verb: 'First', title: 'Is it working?', role: 'Today', text: 'Whether the plant is doing its job right now. This is the answer that usually looks reassuring, and on its own it is the one that gets plants into trouble.' },
      { verb: 'Second', title: 'Will it still be working next week?', role: 'The direction of travel', text: 'Whether the plant is holding steady or drifting underneath. A plant can be perfectly healthy and quietly coming apart at the same time, and this is the answer nothing else on site gives you.' },
      { verb: 'Third', title: 'How much should you trust the first two?', role: 'Honesty about the data', text: 'If the data was thin this week, Hydris says so rather than pretending. A system that will not admit when it is unsure is worse than no system.' },
    ],
  },
  principles: {
    eyebrow: 'Three principles',
    title: 'What we chose not to build.',
    items: [
      { title: 'No black box', text: 'Every answer shows its reasoning. Ask why and Hydris tells you. Your engineer can agree or overrule, your auditor can follow it. Anything that cannot explain itself does not belong in a plant you are accountable for.' },
      { title: 'No waiting', text: 'Something useful on day one. Hydris starts from the curated expert knowledge base rather than learning your plant from nothing, so there is no long silent period before it is worth having.' },
      { title: 'No new hardware', text: 'It runs on what you already collect. Nothing to install, nothing to procure, no capital request to get through the board.' },
    ],
  },
  idea: {
    eyebrow: 'The idea underneath',
    title: 'Find where it started, not where it shows.',
    lede: 'Problems in a treatment plant are almost never where they appear. Something unsteady upstream unsettles the biology, which strains the equipment downstream. The equipment is where you see it. It is not where it began.',
    paras: [
      'Hydris works backwards to the origin. That is the difference between treating a fever and finding the infection, and it is why simple alarms arrive so late. By the time one fires, the chain has been running for days.',
      'Those days are the product. Not the dashboard and not the score, but the time they buy your team to fix the cause instead of compensating for the symptom.',
    ],
    chain: [
      { k: 'Upstream', t: 'Something unsteady' },
      { k: 'Biology', t: 'Gets unsettled' },
      { k: 'Equipment', t: 'Shows the strain' },
    ],
  },
  reach: {
    eyebrow: 'The reach',
    title: 'One plant, or a hundred.',
    lead: 'The same intelligence serves the operator on shift and the executive who has to answer for forty sites.',
    rows: [
      { verb: 'Shift', title: 'The operator', role: 'On the floor', text: 'Knows what deserves attention this morning and what to do about it, without waiting for someone senior to be free.' },
      { verb: 'Site', title: 'The plant manager', role: 'On the site', text: 'Sees the plant as one system rather than a wall of separate numbers, and knows which problems are real before they become expensive.' },
      { verb: 'Group', title: 'The executive', role: 'Across the portfolio', text: 'Compares every site on the same basis, finds the ones quietly at risk, and has the evidence when a customer or a regulator asks.' },
    ],
  },
  start: {
    eyebrow: 'Getting started',
    title: 'Thirty days of data is enough to begin.',
    rows: [
      { k: 'What we need', v: 'The exports you already produce. Control system history, lab results, spreadsheets, procedures, operator logbooks.' },
      { k: 'What we do not need', v: 'New instruments, a change to your control system, a capital request, or anyone technical on your side to run it.' },
      { k: 'Safety', v: 'Hydris only reads. It never writes to your control system and never moves equipment. Your operator stays the only thing that changes a setting.' },
      { k: 'Commercials', v: 'An annual subscription per site, with a one time setup. Multi site programmes are priced as a programme. We will give you the number on a call rather than making you guess from a page.' },
      { k: 'Security', v: 'Single tenant by design. Your IT team will ask early and deserves a straight answer rather than a badge. Write to us and we will tell you what is in place today and what is in progress.' },
    ],
  },
};

/* --------------------------------------------------------------- About */

export const ABOUT = {
  title: 'We have run the plants we build for.',
  lead: 'Hydris was founded by people who spent their careers inside industrial water operations, not adjacent to them.',
  why: {
    eyebrow: 'Why we built Hydris',
    title: 'Twenty years of walking into plants, and the same thing happening every time.',
    lede: 'The data was always there. More of it every year, on better screens, in more systems. And almost every plant still ran on one person who could look at all of it and say what it meant.',
    paras: [
      'When that person was on shift, the plant was fine. When they were on leave, or covering another site, or had retired the year before, the plant was suddenly guessing. Not because anyone was careless, but because the thing that made the plant work had never been written down anywhere.',
      'The same expensive mistake would happen twice, three years apart, in the same building. Somebody had solved it the first time. Nobody could find how.',
      'That is the gap Hydris was created to close. Not another way to measure water, and not another dashboard. A way to hold the judgement that runs a plant so it stops leaving through the door every time somebody does.',
    ],
    quote: '"We did not start Hydris because industrial water needed more measurement. We started it because the industry had run out of the one thing it cannot buy more of: people who know what the numbers mean."',
    cite: 'Vetri Dhagumudi, Founder and Chief Executive',
  },
  founder: {
    eyebrow: 'Founder',
    title: 'Vetri Dhagumudi, Founder and Chief Executive',
    paras: [
      'Vetri grew up where water was not a given. Some days it came and some days it did not, and everyone planned their life around which kind of day it was. He has spent the twenty years since making sure industrial plants never have to find out.',
      'Those twenty years were spent inside industrial water rather than beside it. Engineering and plant operations first, then global responsibility for water strategy across large manufacturing footprints, working on the same problem from the shop floor and from the boardroom. He left that work in June 2026 to build Hydris.',
      'What it taught him was narrow and unarguable. Measurement was never the constraint. Every plant he walked into had more data than it could use and fewer people who knew what it meant. Hydris exists to close that gap.',
    ],
    quote: '"The gap is not more data. We already have data. The gap is intelligence."',
    cite: 'Vetri Dhagumudi',
  },
  protect: {
    eyebrow: 'What we are protecting',
    title: 'A generation of operating knowledge is leaving, and nobody is writing it down.',
    lede: 'Industrial plants are losing the people who know how they actually work. Not the manuals. The judgement. The pattern that says this drift means something and that one does not.',
    paras: [
      'Succession planning covers the org chart. It rarely covers the knowledge. A plant can hire a replacement and still lose the thing that made the last operator good.',
      'Hydris captures that expertise and makes it available to whoever is on shift. We are not automating the decision. We are giving a newer operator access to how an experienced one would think.',
    ],
  },
  work: {
    eyebrow: 'How we work',
    title: 'Two things we do not compromise on.',
    items: [
      { title: 'Operators first', text: 'Every design decision starts with the person on shift, not the person in the boardroom.' },
      { title: 'Show the working', text: 'Hydris never asks an operator to trust an answer they cannot check. Every recommendation shows its reasoning and its source.' },
    ],
  },
  team: {
    eyebrow: 'The team',
    title: 'Water engineers, process specialists and software people.',
    text: 'Hydris is built by water engineers, process specialists and software people working together, across the United States and India. The curated expert knowledge base the platform runs on is built by that team, not scraped from the internet.',
  },
};

/* --------------------------------------------------------------- Press */

export const PRESS = {
  title: 'Press and media',
  lead: 'Everything below is free to use. No form, no gate. For media enquiries, contact',
  lead2: 'We respond within one business day.',
  copyEyebrow: 'Ready-to-use copy',
  copyTitle: 'Boilerplate and bios',
  copy: [
    { k: 'Company · 25 words', v: 'Hydris builds the intelligence layer for industrial water, combining fragmented plant data with captured operator expertise so teams can diagnose problems and act on them faster.' },
    { k: 'Company · 50 words', v: 'Hydris builds the intelligence layer for industrial water. Industrial plants hold vast data across SCADA, laboratory systems, spreadsheets and operator logs, alongside decades of expertise that leaves when experienced staff retire. Hydris captures that expertise, applies it to live plant data, and guides operators toward action.' },
    { k: 'Boilerplate · 100 words', v: 'Hydris, Inc. is building the intelligence layer for industrial water. Industrial plants hold vast operational data across SCADA, laboratory systems, spreadsheets and operator logs, alongside decades of expertise that leaves when experienced staff retire. Hydris captures that expertise, applies it to live plant data, and guides operators toward action. Three products serve the plant floor. Hydris Lite for daily plant intelligence, Hydris Pulse for guided troubleshooting, and Hydris Field for hands-free field operations. Hydris serves food and beverage, textile, pulp and paper and chemical manufacturers. The company was founded in 2025 and is headquartered in Portland, Oregon.' },
    { k: 'Founder · 75 words', v: 'Vetri Dhagumudi is founder and chief executive of Hydris, which builds the operational intelligence layer for industrial water. He spent nearly two decades in industrial water engineering, plant operations and global water strategy for large manufacturers, working the same problem from the shop floor and from the boardroom. He grew up where water was not a given, which is what pointed him at the industry in the first place. He left that work in June 2026 to build Hydris.' },
  ],
  assetsEyebrow: 'Downloads',
  assetsTitle: 'Assets',
  assets: [
    { k: 'Logos', v: 'Horizontal logo, PNG on transparent background at 2000px. Horizontal logo, SVG. White versions for dark backgrounds. Droplet mark.' },
    { k: 'Photography', v: 'Founder headshot, high resolution. Founder environmental portrait, ideally at a real plant. Both cleared for editorial use.' },
    { k: 'Product', v: 'Screenshots of Lite, Pulse and Field, with all plant data anonymised. Architecture diagram. See, Understand, Act, Prove visual.' },
  ],
};

/* ------------------------------------------------------------- Contact */

export const CONTACT = {
  title: 'If you run an industrial water plant, we would like to hear how it actually runs.',
  lead: 'Different people arrive here for different reasons. Pick the one that fits and you will reach the right person rather than a queue.',
  routes: [
    { key: 'plant', pick: 'I run a plant', who: 'If you run a plant', title: 'Send us thirty days of data', text: 'No demo script. We run your own plant data through the engine and walk you through what it says, including the parts that look fine. If Hydris is not the right fit we will tell you.', email: 'hello@hydris.ai' },
    { key: 'press', pick: 'I am a journalist', who: 'If you are a journalist', title: 'Press and media', text: 'Assets, boilerplate and bios are on the press page, free to use, no form. We respond within one business day.', email: 'press@hydris.ai' },
    { key: 'work', pick: 'I want to build this', who: 'If you want to build this', title: 'Working at Hydris', text: 'We are hiring engineers and water people. There is no jobs board yet. Write to us with what you have built and what you want to work on.', email: 'hello@hydris.ai' },
  ],
  details: [
    { h: 'Headquarters', lines: ['Hydris, Inc.', 'Portland, Oregon', 'United States'] },
    { h: 'Operations', lines: ['Puducherry, India'], mail: EMAIL_OPS },
    { h: 'Telephone', lines: [PHONE] },
    { h: 'Data and security questions', lines: ['Industrial IT teams ask early. Write to us and you get a straight answer about what is true today rather than a brochure.'] },
  ],
};

export const FACILITIES = ['Food and beverage', 'Textiles', 'Pulp and paper', 'Chemicals', 'Other industrial'];

/* --------------------------------------------------------------- Legal */

export const PRIVACY = {
  title: 'Privacy policy',
  updated: 'Draft of 5 September 2026. Requires review by counsel before publishing.',
  intro: 'Hydris, Inc. builds software for industrial water operations. This policy explains what personal information we collect through hydris.ai, why, and what you can do about it. It covers the website only. Personal information we process for a customer under a services agreement is governed by that agreement.',
  sections: [
    ['What we collect', 'When you email us we receive your address and whatever you write. When you subscribe to the monthly note we collect the address you give us. When you visit, our analytics provider records aggregate page views, referring site, approximate country and device type. No advertising cookies, no behavioural profiles, no cross-site tracking.'],
    ['Why we use it', 'To answer you, to send the monthly note if you asked for it, and to understand which pages are useful. That is the complete list. We do not sell personal information, we do not rent or share our list, and we do not use it for automated decision making.'],
    ['How long we keep it', "Correspondence for as long as the relationship is active and a reasonable period after. Subscription addresses until you unsubscribe, and we delete rather than suppress. Aggregate analytics on our provider's standard schedule."],
    ['Who we share it with', 'Only the providers who make the site and our email work, acting on our instructions and bound to confidentiality. Email is hosted by Microsoft. We will name the analytics and email delivery providers here once selected. We may disclose where the law requires it.'],
    ['Where it goes', 'Hydris is a United States company that also operates in India, and information may be processed in both. Where information leaves the United Kingdom or European Economic Area we rely on the safeguards applicable law permits.'],
    ['Your rights', 'Depending on where you live you may have the right to access, correct, delete, object, restrict, port, and withdraw consent. Write to us and we will act on it. We will not make you jump through hoops and we will not charge you. If you are in the EEA or UK and unhappy with how we handled a request, you may complain to your supervisory authority.'],
    ['Children', 'This site is for business use. We do not knowingly collect information from anyone under sixteen.'],
    ['Changes', 'If we change this materially we update the date above and tell subscribers directly rather than relying on you to check.'],
  ],
  contact: 'Hydris, Inc., Portland, Oregon, United States.',
};

export const TERMS = {
  title: 'Terms of use',
  updated: 'Draft of 5 September 2026. Requires review by counsel before publishing.',
  intro: 'These terms govern use of hydris.ai. They do not govern use of the Hydris platform, which is covered by the separate agreement between Hydris, Inc. and the customer.',
  sections: [
    ['Using this site', 'You may read, print and share anything here. You may not scrape it at a volume that degrades it for others, attempt unauthorised access, or represent the content as your own work.'],
    ['Our content', 'The text, design, diagrams and marks belong to Hydris, Inc. Press materials on the press page are made available for editorial use, including logos and photographs, and may be reproduced in coverage of the company without further permission.'],
    ['What this site is not', 'Nothing here is engineering advice for a specific plant, and nothing here is an offer or a warranty. Illustrative figures and example readouts are constructed for explanation. They are not results, not predictions, and not drawn from customer data. Do not make an operating decision at a real facility on the basis of anything on this website.'],
    ['Third party links', 'We link out occasionally. We do not control those sites and are not responsible for them.'],
    ['Liability', 'The site is provided as it is. To the extent the law allows, Hydris is not liable for loss arising from use of this website. Nothing here limits liability that cannot lawfully be limited.'],
    ['Governing law', 'Governed by the laws of the State of Oregon, United States, whose courts have exclusive jurisdiction, without affecting mandatory rights where you live.'],
  ],
};

/* -------------------------------------------------------------- Footer */

export const FOOTER = {
  tag: 'Capture knowledge. Guide decisions. Strengthen operations.',
  cols: [
    { h: 'Platform', links: [['How it works', '/#how'], ['Getting started', '/platform/#start']] },
    { h: 'Company', links: [['About', '/about/'], ['Press', '/press/'], ['Contact', '/contact/']] },
    { h: 'Legal', links: [['Privacy', '/privacy/'], ['Terms', '/terms/']] },
  ],
  line: 'Hydris, Inc. Portland, Oregon.',
  right: 'Operational Water Intelligence',
};
