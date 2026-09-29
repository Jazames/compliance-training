// Internal, text-free visual verification; not bundled into the course.
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RiveCharacter } from '../../src/rive/RiveCharacter';
import '../../src/styles.css';
const q = new URLSearchParams(location.search);
export function Preview() {
  const [blend, setBlend] = useState(Number(q.get('blend') ?? 0));
  useEffect(() => {
    if (!q.has('cycle')) return;
    const timer = setInterval(() => setBlend(value => value ? 0 : 1), 2400);
    return () => clearInterval(timer);
  }, []);
  return <div style={{ display: 'flex', background: '#edece7', minHeight: '100vh' }}>
    {(['generic-man', 'generic-woman'] as const).map(artboard => <div key={artboard} style={{ width: 400, height: 640 }}>
      <RiveCharacter artboard={artboard} name="" side="center" action={q.get('action') as 'walk' | 'talk' | 'grab' | 'interact' || 'idle'}
        appearanceBlend={blend} seated={q.has('sit')} sittingStyle={q.has('front') ? 'front' : q.has('profile') ? 'sideways' : 'three-quarter'}
        driftAppearance={{ romance: q.get('mode') === 'heist' || q.get('mode') === 'survival' ? 0 : blend, heist: q.get('mode') === 'heist' ? blend : 0, survival: q.get('mode') === 'survival' ? blend : 0 }}
        topId={Number(q.get('top') ?? 0)} bottomId={Number(q.get('bottom') ?? 0)}
        skinColor={q.get('skin') ?? '#CFA17E'} hairColor={q.get('hair') ?? '#3D302C'} />
    </div>)}
  </div>;
}
createRoot(document.getElementById('root')!).render(<Preview />);
