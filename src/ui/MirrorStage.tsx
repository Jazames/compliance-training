import type { PlayerAppearance } from '../engine/playerAppearance';
import { RiveCharacter } from '../rive/RiveCharacter';

/** Keep the animated rig intact; the mirror viewport crops away its body. */
export function MirrorStage({ player }: { player: PlayerAppearance }) {
  return <div className="mirror-stage">
    <div className="mirror-frame">
      <div className="mirror-reflection">
        <div className="mirror-portrait">
          <RiveCharacter {...player} side="center" facing="left" action="idle" />
        </div>
      </div>
    </div>
    <svg className="mirror-sink" viewBox="0 0 1000 190" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 30H1000V190H0Z" fill="#849c9c" />
      <path d="M0 30H1000L970 70H30Z" fill="#dfe9e6" />
      <ellipse cx="500" cy="91" rx="280" ry="83" fill="#f8faf7" stroke="#aabfbe" strokeWidth="5" />
      <ellipse cx="500" cy="81" rx="217" ry="53" fill="#c6d8d7" />
      <ellipse cx="500" cy="98" rx="21" ry="7" fill="#688487" />
      <path d="M500 55V-20Q500-44 535-38V-8" fill="none" stroke="#587b81" strokeWidth="22" />
      <path d="M495 52V-20Q495-40 530-34" fill="none" stroke="#d1e1e2" strokeWidth="7" />
      <path d="M410 27h42m96 0h42" stroke="#6b8a8d" strokeWidth="15" strokeLinecap="round" />
    </svg>
  </div>;
}
