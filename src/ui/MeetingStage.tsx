import { useState } from 'react';
import type { PlayerAppearance } from '../engine/playerAppearance';
import { RiveCharacter } from '../rive/RiveCharacter';
import { getHairAccentColor } from '../engine/hairColors';

export function MeetingStage({ player }: { player: PlayerAppearance }) {
  const [guests] = useState(() => Array.from({ length: 4 }, (_, index) => {
    const pick = (colors: string[]) => colors[Math.floor(Math.random() * colors.length)];
    const hairColor = pick(['#181412', '#3D302C', '#794B35', '#A8A8A8']);
    return { artboard: index % 2 ? 'generic-woman' as const : 'generic-man' as const,
      skinColor: pick(['#F3D9C6', '#CFA17E', '#805238', '#593A29']),
      hairColor, hairAccentColor: getHairAccentColor(hairColor),
      outfitPrimaryColor: pick(['#647885', '#7C776F', '#6D7F70', '#8D7889']),
    };
  }));
  return <div className="meeting-stage" aria-hidden="true">
    <div className="meeting-window" /><div className="meeting-board" />
    {guests.slice(0, 3).map((guest, index) => <div className="meeting-guest" key={index} style={{ left: `${12 + index * 27}%` }}>
      <RiveCharacter {...guest} name="" side="center" action="idle" seated topId={0} bottomId={0} appearanceBlend={0} />
    </div>)}
    <div className="meeting-table" />
    <div className="meeting-presenter"><RiveCharacter {...guests[3]} name="" side="left" action="interact" topId={0} bottomId={0} appearanceBlend={0} />
      <svg className="meeting-gift" viewBox="0 0 100 62"><path d="M-65 -10 L-65 46 Q-63 60 -48 56 L12 36" fill="none" stroke={guests[3].skinColor} strokeWidth="14" strokeLinecap="round" /><rect x="2" y="2" width="96" height="58" rx="6" fill="#eee3c7" stroke="#8b7955" strokeWidth="3" /><path d="M70 3v56M3 22h94" stroke="#a692b2" strokeWidth="9" /><path d="m69 22-16-12q-13-4-9 7 4 8 25 5m0 0 12-14q12-5 10 6-3 8-22 8" fill="none" stroke="#8a739a" strokeWidth="4" /></svg>
    </div>
    <div className="meeting-player"><RiveCharacter {...player} side="right" facing="left" action="idle" /></div>
  </div>;
}
