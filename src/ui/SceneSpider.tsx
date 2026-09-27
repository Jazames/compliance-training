import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useStageRuntime } from './stageContext';

// Decorative vector: eight jointed legs, plain oval abdomen and violin marking.
export function SceneSpider({ enabled, eligible, delayMs = 37_000 }: { enabled: boolean; eligible: boolean; delayMs?: number }) {
  const [elapsed, setElapsed] = useState(false);
  const { playing } = useStageRuntime();
  const remaining = useRef(delayMs);
  const [path] = useState(() => ({ reverse: Math.random() < 0.5, floor: 4 + Math.random() * 14 }));
  useEffect(() => {
    if (!playing || elapsed) return;
    const start = performance.now();
    const timer = window.setTimeout(() => setElapsed(true), remaining.current);
    return () => { remaining.current -= performance.now() - start; window.clearTimeout(timer); };
  }, [playing, elapsed]);
  return <div aria-hidden="true" className={`spider-track${path.reverse ? ' spider-track--reverse' : ''}`}
    style={{ '--spider-floor': `${path.floor}px`, visibility: enabled && eligible ? 'visible' : 'hidden' } as CSSProperties}>
    {elapsed ? <svg className="scene-spider" viewBox="0 0 120 100">
      <ellipse cx="60" cy="55" rx="25" ry="12" fill="#332619" opacity=".14" />
      <g className="spider-legs spider-legs--a">
        <path d="M65 45 83 25 108 17M62 48 81 63 100 85M65 52 48 74 23 80M65 44 44 27 19 20" />
      </g>
      <g className="spider-legs spider-legs--b">
        <path d="M70 43 84 33 112 37M67 49 86 51 110 65M69 43 52 19 32 9M61 50 40 56 13 66" />
      </g>
      <ellipse cx="49" cy="49" rx="18" ry="12" fill="#94714e" stroke="#6a4b30" strokeWidth="1.5" />
      <ellipse cx="69" cy="46" rx="13" ry="10" fill="#ae8558" stroke="#705034" strokeWidth="1.5" />
      <path d="M60 45h7c1-4 7-4 8 0 3 0 3 4 0 4-1 4-7 4-8 0h-7z" fill="#593b27" />
      <path d="m79 42 8-4m-8 11 8 4" fill="none" stroke="#795233" strokeWidth="2" />
    </svg> : null}
  </div>;
}
