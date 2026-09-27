import type { PlayerAppearance } from '../engine/playerAppearance';
import { RiveCharacter } from '../rive/RiveCharacter';

/** Match the bathroom SVG's coordinate system, including its responsive crop. */
export function RestroomOccupant({ fixture, player }: { fixture: 1 | 2 | 3; player: PlayerAppearance }) {
  const x = 445 + (fixture - 1) * 205;
  return <svg className="restroom-occupant" viewBox="0 0 1120 690" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d={`M${x} 117h190v362H${x}z`} fill="#637c7d" stroke="#617d82" strokeWidth="7" />
    <foreignObject x={x + 5} y={130} width={180} height={390}>
      <div className="restroom-occupant__character">
        <RiveCharacter {...player} side="center" action="idle" />
      </div>
    </foreignObject>
    <path d={`M${x + 190} 117l-38 22v340l38 0z`} fill="#a4babd" stroke="#617d82" strokeWidth="5" />
  </svg>;
}
