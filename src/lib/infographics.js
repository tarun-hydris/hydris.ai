// The Hydris infographic set (public/ig/<name>-<w>.webp). Each illustration has blank label plates;
// the labels below are placed over them as real text (x, y = centre in % of the image). `w` is the
// label's maximum width in % of the image when it sits on a plate; tags without `w` sit beside an
// object. Every schematic is an illustration, not plant data.
export const IG = {
  'venn-hydris': {
    size: [1254, 1254],
    alt: 'Diagram: three overlapping circles, plant data, water science and team experience, meet in the centre at Hydris',
    labels: [
      { t: 'Plant data', x: 50, y: 22.3, w: 19 },
      { t: 'Water science', x: 26.2, y: 64.5, w: 19 },
      { t: 'Team experience', x: 73.7, y: 64.5, w: 19 },
      { t: 'Hydris', x: 50, y: 51.3, w: 13, strong: true },
    ],
  },
  'lite-see': {
    size: [1672, 941],
    alt: 'Diagram: layers of plant readings gather into clusters, then highlight what needs attention, then become a few clear scores',
    labels: [
      { t: 'A few clear scores', x: 76, y: 24 },
      { t: 'What needs attention', x: 76, y: 42 },
      { t: 'Readings in context', x: 76, y: 61 },
      { t: 'Every reading the plant collects', x: 76, y: 78 },
    ],
  },
  'pulse-understand': {
    size: [1672, 941],
    alt: 'Diagram: a question leads to three ranked possible causes, each with its evidence, and ends with the operator deciding',
    labels: [
      { t: 'Why is TSS drifting in the effluent?', x: 16.5, y: 46, w: 19, q: true },
      { t: 'Most likely cause', x: 63, y: 29.5, w: 28 },
      { t: 'Possible cause', x: 61, y: 50.5, w: 24 },
      { t: 'Less likely', x: 59, y: 70.5, w: 20 },
      { t: 'Operator decides', x: 92, y: 63 },
    ],
  },
  'field-act': {
    size: [1672, 941],
    alt: 'Diagram: a guided round through a pump, a coupling check, a pressure gauge reading of 4.2 bar shown in smart glasses, a checklist and the shift record',
    labels: [
      { t: '1 Go to Pump P-2', x: 12, y: 91 },
      { t: '2 Check coupling', x: 35, y: 81 },
      { t: '4.2 bar', x: 62.3, y: 34, w: 6, strong: true },
      { t: '3 Read the gauge', x: 55, y: 70 },
      { t: '4 Complete the checklist', x: 76, y: 62.5 },
      { t: 'Shift record', x: 92, y: 47 },
    ],
  },
  'shift-memory': {
    size: [1938, 812],
    alt: 'Diagram: a glass vault of layered plant knowledge passes observations, evidence, decisions and records forward from the day shift to the night shift',
    labels: [
      // The five steps are named in the handover line right below the picture
      { t: 'What the plant knows', x: 21.5, y: 90 },
      { t: 'Day shift', x: 54, y: 9 },
      { t: 'Night shift', x: 85, y: 9 },
    ],
  },
  stewardship: {
    size: [1730, 909],
    alt: 'Diagram: one brand connected to five supplier factories, each with a water status ring; one factory reuses its water',
    labels: [
      { t: 'Brand', x: 50, y: 37 },
      { t: 'Supplier A', x: 12.5, y: 90 },
      { t: 'Supplier B', x: 31, y: 90 },
      { t: 'Supplier C: water reuse', x: 50, y: 90 },
      { t: 'Supplier D', x: 69, y: 90 },
      { t: 'Supplier E', x: 88, y: 90 },
    ],
  },
  portfolio: {
    size: [1730, 909],
    alt: 'Diagram: many sites drawn as points on a dotted map, three flagged, with a small chart highlighting where to invest first',
    labels: [
      { t: 'Invest first', x: 94.6, y: 12.8, w: 7.5, strong: true },
      { t: 'Site 3', x: 27, y: 33 },
      { t: 'Site 9', x: 73, y: 59 },
      { t: 'Site 14', x: 52, y: 81 },
      { t: 'Risk across every site', x: 80.5, y: 38 },
    ],
  },
  'every-drop': {
    size: [1672, 941],
    alt: 'Illustration: a river runs from a treatment plant past towns and homes toward the sunrise, with a water droplet above',
    labels: [],
  },
  'five-step-loop': {
    size: [1915, 821],
    alt: 'Diagram: five steps on one loop: data, understand, reason, act and learn, returning to data',
    labels: [
      { t: '01 Data', x: 50, y: 33 },
      { t: '02 Understand', x: 82.5, y: 54 },
      { t: '03 Reason', x: 68.5, y: 87 },
      { t: '04 Act', x: 32, y: 89 },
      { t: '05 Learn', x: 18, y: 54 },
    ],
  },
  'onboarding-timeline': {
    size: [1916, 821],
    alt: 'Diagram: four rising steps: send your exports, configure with your team, go live with a daily read, then add Pulse and Field',
    labels: [
      { t: 'Week 1: send your exports', x: 16.7, y: 79, w: 15 },
      { t: 'Weeks 2 to 3: configure with your team', x: 40.1, y: 72.5, w: 15 },
      { t: 'Go live: a daily read', x: 63.5, y: 61, w: 15 },
      { t: 'Add Pulse and Field', x: 86.8, y: 51.5, w: 15 },
    ],
  },
  'us-india': {
    size: [1774, 887],
    alt: 'Map: a line joins Portland, Oregon in the United States to Puducherry in India',
    labels: [
      { t: 'Portland, Oregon', x: 13.5, y: 37.5 },
      { t: 'Puducherry, India', x: 76, y: 60.5 },
    ],
  },
};
