// Internal text-free posture/wardrobe verification. Not a production entry.
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RiveCharacter } from '../../src/rive/RiveCharacter';
import '../../src/styles.css';
const query = new URLSearchParams(location.search);
export function Preview() {
  const [seated, setSeated] = useState(!query.get('stand'));
  useEffect(() => {
    if (!query.get('cycle')) return;
    const timer = setTimeout(() => setSeated(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  return <div style={{ display: 'flex', background: '#eee' }}>
  {(['generic-man', 'generic-woman'] as const).map(artboard => <div key={artboard} style={{ width: 400, height: 640 }}>
    <RiveCharacter artboard={artboard} name="" side="center" action={query.get('walk') ? 'walk' : 'talk'}
      seated={seated} sittingStyle={query.get('front') ? 'front' : query.get('profile') ? 'sideways' : 'three-quarter'}
      facing={query.get('left') ? 'left' : 'right'} appearanceBlend={Number(query.get('blend') ?? 0)}
      topId={Number(query.get('top') ?? 0)} bottomId={Number(query.get('bottom') ?? 0)} />
  </div>)}
</div>;
}
createRoot(document.getElementById('root')!).render(<Preview />);
