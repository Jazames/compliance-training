// Internal, text-free visual harness; excluded from the production entry point.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HallwayStage } from '../../src/ui/HallwayStage';
import { MustardStage } from '../../src/ui/MustardStage';
import { defaultClothing } from '../../src/engine/playerAppearance';
import '../../src/styles.css';

const params = new URLSearchParams(location.search);
const blend = Number(params.get('blend') ?? 0);
createRoot(document.getElementById('root')!).render(<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
  {(['generic-man', 'generic-woman'] as const).map(artboard => {
    const player = { ...defaultClothing(artboard === 'generic-man' ? 'daniel' : 'rachel'),
      artboard, name: '', skinColor: '#CFA17E', eyeColor: '#58616A', hairColor: '#49352D',
      hairAccentColor: '#A87A4A', appearanceBlend: blend,
      topId: Number(params.get('top') ?? 0), bottomId: Number(params.get('bottom') ?? 0) };
    return <div key={artboard}>
      <MustardStage player={player} action="spill" entryActive />
      <HallwayStage player={player} action="pickup" entryActive={false} />
    </div>;
  })}
</div>);
