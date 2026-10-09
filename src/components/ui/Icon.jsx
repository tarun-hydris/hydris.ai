import { Children, Fragment, cloneElement } from 'react';

// Thin line icons on a 24px grid, drawn for this site.
const P = {
  arrow: <path d="M7 17L17 7M9 7h8v8" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" />,
  up: <path d="M12 19V5M6 11l6-6 6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  plus: <path d="M12 5v14M5 12h14" />,
  bolt: <path d="M13 2.5L4.5 13.5h6.5l-1 8 8.5-11h-6.5l1-8z" />,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.7c1.9.8 3.1 2.6 3.5 5.3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></>,
  coins: <><ellipse cx="9" cy="6.5" rx="6" ry="2.5" /><path d="M3 6.5v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5M3 11.5v5c0 1.4 2.7 2.5 6 2.5 1 0 2-.1 2.8-.3M15 13.5c3.3 0 6 1.1 6 2.5s-2.7 2.5-6 2.5" /></>,
  book: <path d="M4 19V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h14M9 7.5h7M9 11h5" />,
  chart: <path d="M3.5 20.5h17M6.5 17v-5M11 17V7M15.5 17v-7.5M20 17V4" />,
  alert: <path d="M12 3.5l9 16H3zM12 10v4M12 17.2v.1" />,
  doc: <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3.8 6.8L12 13l8.2-6.2" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="1.5" /><path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5" /></>,
  flow: <><rect x="3" y="3" width="6.5" height="6.5" /><rect x="14.5" y="14.5" width="6.5" height="6.5" /><path d="M9.5 6.2h3.8a3 3 0 0 1 3 3v5.3" /></>,
  chat: <path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 21l1.4-4.6A8.5 8.5 0 1 1 20.5 12z" />,
  filter: <path d="M4 5h16l-6 7.5V19l-4 2v-8.5z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20.5 20.5L16 16" /></>,
  cal: <><rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  drop: <path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z" />,
  send: <path d="M12 19V5M6 11l6-6 6 6" />,
  /* Hydris v16 set */
  nocap: <><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6L18.4 18.4M12 7.6v8.8" /><path d="M14.3 9.6c-.4-.8-1.3-1.3-2.4-1.3-1.4 0-2.5.8-2.5 1.9 0 1 .9 1.6 2.5 1.9 1.6.3 2.5.9 2.5 1.9 0 1.1-1.1 1.9-2.5 1.9-1.1 0-2-.5-2.4-1.3" /></>,
  nosensor: <><path d="M12 3.4v3M12 17.6v3M3.4 12h3M17.6 12h3" /><circle cx="12" cy="12" r="3.4" /><path d="M4.6 4.6L19.4 19.4" /></>,
  stack: <><ellipse cx="12" cy="5.6" rx="7.4" ry="2.9" /><path d="M4.6 5.6v6.4c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V5.6" /><path d="M4.6 12v6.4c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V12" /></>,
  weeks: <><path d="M21 12a9 9 0 1 1-2.6-6.4" /><path d="M21.4 4.2v4.6h-4.6" /><path d="M12 7.6V12l3 1.9" /></>,
  shield: <><path d="M12 2.8L4.6 6v6c0 4.6 3.1 8.2 7.4 9.2 4.3-1 7.4-4.6 7.4-9.2V6z" /><path d="M9 12l2.2 2.2L15.4 10" /></>,
  hand: <><path d="M8.4 11.4V5.6a1.7 1.7 0 0 1 3.4 0v5.1" /><path d="M11.8 10.6V9.2a1.6 1.6 0 0 1 3.2 0v1.9" /><path d="M15 10.9V9.8a1.6 1.6 0 0 1 3.2 0v5.6c0 3.3-2.3 5.9-5.6 5.9-3 0-4.6-1.4-6.2-3.7l-2-3a1.6 1.6 0 0 1 2.5-2l1.5 1.6" /></>,
  trend: <><path d="M3.4 18.6L8.6 12l4 3.4 7.6-9.4" /><path d="M15.6 6h4.6v4.6" /><path d="M3.4 20.6h17.2" /></>,
  lite: <><rect x="3" y="4" width="18" height="16" rx="2.2" /><path d="M3 9.2h18M8.4 9.2V20" /><path d="M11.6 12.6h6M11.6 16h4" /></>,
  pulse: <path d="M2.6 12h4.1l2.2-6.2 4 12.6 2.3-6.4h6.2" />,
  field: <><circle cx="6.6" cy="13.4" r="3.7" /><circle cx="17.4" cy="13.4" r="3.7" /><path d="M10.3 13.4c.5-.9 2.9-.9 3.4 0" /><path d="M2.9 13.4l1.5-5.2a2 2 0 0 1 1.9-1.4h1.5" /><path d="M21.1 13.4l-1.5-5.2a2 2 0 0 0-1.9-1.4h-1.5" /></>,
  operator: <><path d="M4.4 19.4a7.6 7.6 0 0 1 15.2 0" /><path d="M6.4 11.6a5.6 5.6 0 0 1 11.2 0" /><path d="M2.4 11.6h1.6M20 11.6h1.6M12 4.4V6" /></>,
  manager: <><rect x="2.8" y="7.2" width="18.4" height="13" rx="2" /><path d="M8.6 7.2V5.6a2 2 0 0 1 2-2h2.8a2 2 0 0 1 2 2v1.6" /><path d="M2.8 12.4h18.4" /></>,
  engineer: <><circle cx="12" cy="12" r="3" /><path d="M19.6 14.6a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9.1 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9.1a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9.1a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.56 1.03z" /></>,
  leaf: <><path d="M11 20.4A7.4 7.4 0 0 1 3.6 13C3.6 7.4 8.6 3.2 20.4 3.6c.4 11.8-3.8 16.8-9.4 16.8z" /><path d="M4.2 20.4C8 16.6 11.4 12.6 20.4 3.6" /></>,
  bars: <><path d="M3.4 20.4h17.2" /><path d="M6.6 20.4V11M11.6 20.4V6.4M16.6 20.4v-6" /></>,
  chip: <><rect x="6.6" y="6.6" width="10.8" height="10.8" rx="1.6" /><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="2.4" /><path d="M9.6 1.6v1.8M14.4 1.6v1.8M9.6 20.6v1.8M14.4 20.6v1.8M22.4 9.6h-1.8M22.4 14.4h-1.8M3.4 9.6H1.6M3.4 14.4H1.6" /></>,
  scale: <><path d="M12 3.4v17.2" /><path d="M4.6 7.4h14.8" /><path d="M4.6 7.4l-2.6 6a2.9 2.9 0 0 0 5.2 0z" /><path d="M19.4 7.4l-2.6 6a2.9 2.9 0 0 0 5.2 0z" /><path d="M8.4 20.6h7.2" /></>,
  lock: <><rect x="4.2" y="10.4" width="15.6" height="10.4" rx="2" /><path d="M8.2 10.4V7.2a3.8 3.8 0 0 1 7.6 0v3.2" /></>,
  layers: <><path d="M12 2.8l9 4.8-9 4.8-9-4.8z" /><path d="M3 12.4l9 4.8 9-4.8" /><path d="M3 16.8l9 4.8 9-4.8" /></>,
  reason: <><circle cx="6" cy="7" r="2.2" /><circle cx="6" cy="17" r="2.2" /><circle cx="18" cy="12" r="2.2" /><path d="M8 8.2L15.9 11M8 15.8L15.9 13" /></>,
  eye: <><path d="M2.2 12S5.7 5.4 12 5.4 21.8 12 21.8 12 18.3 18.6 12 18.6 2.2 12 2.2 12z" /><circle cx="12" cy="12" r="2.9" /></>,
  flask: <path d="M9.5 3.5h5M10.5 3.5v6L5 19a1.5 1.5 0 0 0 1.3 2.2h11.4A1.5 1.5 0 0 0 19 19l-5.5-9.5v-6M7.6 15h8.8" />,
  grid: <><rect x="3.5" y="4" width="17" height="16" rx="1.5" /><path d="M3.5 9.3h17M3.5 14.7h17M9.2 4v16M14.8 4v16" /></>,
  pin: <><path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  phone: <path d="M5 4h4l1.5 4-2.2 1.4a11 11 0 0 0 5.3 5.3L15 12.5l4 1.5v4a1.5 1.5 0 0 1-1.6 1.5C10.7 19.2 4.8 13.3 4.5 5.6A1.5 1.5 0 0 1 5 4z" />,
  refresh: <path d="M20 11a8 8 0 0 0-14.7-4.4L4 8M4 3.5V8h4.5M4 13a8 8 0 0 0 14.7 4.4L20 16M20 20.5V16h-4.5" />,
};

/* pathLength=1 on every shape lets CSS draw any icon with stroke-dashoffset (see .icon--draw) */
const normalise = (node) => (node.type === Fragment
  ? Children.map(node.props.children, (c) => cloneElement(c, { pathLength: 1 }))
  : cloneElement(node, { pathLength: 1 }));

export default function Icon({ name, className = '' }) {
  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {className.includes('icon--draw') ? normalise(P[name]) : P[name]}
    </svg>
  );
}

export function Arrow({ dir = 'arrow' }) {
  return <Icon name={dir} className="arrow" />;
}
