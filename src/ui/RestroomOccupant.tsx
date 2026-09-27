import type { PlayerAppearance } from '../engine/playerAppearance';
import { RiveCharacter } from '../rive/RiveCharacter';

/** Shared four-fixture geometry for both bathroom variants and their outcomes. */
export function RestroomOccupant({ fixture, player }: { fixture?: 0 | 1 | 2 | 3; player: PlayerAppearance }) {
  const male = player.artboard === 'generic-man';
  return <svg className="restroom-occupant" viewBox="0 0 1120 690" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 0h1120v490H0z" fill="#d5e3e2" />
    <path d="M0 490h1120v200H0z" fill="#99abaa" />
    <path d="M0 565h1120M0 635h1120M110 490 30 690M360 490 330 690M610 490 630 690M860 490 930 690" stroke="#cad7d3" strokeWidth="2" />
    {[0, 1, 2, 3].map((index) => {
      const x = 70 + index * 250;
      return <g key={index}>
        {male ? <>
          <path d={`M${x+100} 190v55`} stroke="#6d898c" strokeWidth="12" />
          <path d={`M${x+30} 240h140v190q-70 95-140 0z`} fill="#f3f6f3" stroke="#70898e" strokeWidth="6" />
          <path d={`M${x+55} 265h90v140q-45 60-90 0z`} fill="#d4e4e3" />
          <path d={`M${x+220} 175v335`} stroke="#718c8e" strokeWidth="8" />
          {index === 0 ? <g>
            <circle cx={x+100} cy="235" r="32" fill="#ad8065" />
            <path d={`M${x+57} 275h86l15 155H${x+42}z`} fill="#526773" />
            <path d={`M${x+73} 430v130m54-130v130`} stroke="#303f49" strokeWidth="30" />
          </g> : null}
        </> : <>
          <path d={`M${x} 160v420m210-420v420M${x} 160h210`} stroke="#eef3ed" strokeWidth="12" />
          <path d={`M${x+9} 170h192v345H${x+9}z`} fill={fixture === index ? '#70898c' : '#a7bec1'} stroke="#647f85" strokeWidth="5" />
          <circle cx={x+178} cy="355" r="7" fill="#5c747a" />
          {index === 0 ? <path d={`M${x+64} 535h30v32h-44zM${x+119} 535h30l14 32h-44z`} fill="#303f49" /> : null}
        </>}
        {fixture === index ? <>
          <foreignObject x={x + (index === 0 ? 65 : 0)} y="190" width="200" height="390">
            <div className="restroom-occupant__character"><RiveCharacter {...player} side="center" action={index === 0 ? 'interact' : 'idle'} /></div>
          </foreignObject>
          {!male && index !== 0 ? <path d={`M${x+201} 170l-30 20v325h30z`} fill="#a7bec1" stroke="#647f85" strokeWidth="5" /> : null}
        </> : null}
      </g>;
    })}
  </svg>;
}
