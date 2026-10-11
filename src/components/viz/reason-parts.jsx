import { useCallback, useRef, useState } from 'react';
import { sleep } from '../../lib/hooks.js';

/* Shared parts for the three "reason" widgets (Context, Trace, Recommend). */

/* A ring and a tick, both drawn with stroke-dashoffset when an ancestor gets .is-in */
export function Check({ className = '' }) {
  return (
    <svg className={`vz-check ${className}`} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" pathLength="1" />
      <path d="M4.9 8.3l2.1 2.1 4.2-4.5" pathLength="1" />
    </svg>
  );
}

/* Phase state with a ref mirror, so an async loop can read the current phase */
export function usePhase(initial = 0) {
  const [ph, setPh] = useState(initial);
  const ref = useRef(initial);
  const go = useCallback((n) => { ref.current = n; setPh(n); }, []);
  return [ph, go, ref];
}

/* Graceful reset: fade the dynamic layers, snap everything back with transitions off,
   then hand back to phase 0. Returns false if the loop was cancelled on the way. */
export async function settle(ref, go, alive, fade, snap, ms = 600) {
  if (ref.current === 0) return alive();
  go(fade);
  await sleep(ms);
  if (!alive()) return false;
  go(snap);
  await sleep(70);
  if (!alive()) return false;
  go(0);
  await sleep(40);
  return alive();
}
