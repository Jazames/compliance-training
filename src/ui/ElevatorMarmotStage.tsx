import type { PlayerAppearance } from '../engine/playerAppearance';
import { RiveCharacter } from '../rive/RiveCharacter';
import type { SceneDef } from '../engine/sceneTypes';

export function ElevatorMarmotStage({ player, entryActive, action, phoneLabel }: { player: PlayerAppearance; entryActive: boolean; action?: SceneDef['elevatorAction']; phoneLabel?: string }) {
  const calling = action === 'facilities' || action === 'emergency';
  return <div className={`elevator-encounter${entryActive ? '' : ' is-settled'} elevator-action--${action ?? 'arrival'}`} aria-hidden="true">
    <svg className="elevator-hall" viewBox="0 0 1000 600" preserveAspectRatio="none">
      <path fill="#b9c3c5" d="M0 0h1000v600H0z" />
      <path fill="#72838a" d="M0 420h1000v180H0z" />
      <path fill="#5e7077" d="M0 70h145v350H0z" />
      <path fill="#d4dbdc" d="M145 40h35v390h-35z" />
      <path stroke="#a5b2b7" strokeWidth="3" d="m300 420-70 180m330-180 40 180m180-180 155 180M0 490h1000M0 570h1000" />
      <path stroke="#e7ebea" strokeWidth="10" d="M220 45h280" />
      <path fill="#3d4c53" d="M600 75h280v365H600z" />
      <path fill="#84959b" d="M620 95h240v325H620z" />
      <path fill="#657880" d="M620 340h240v80H620z" />
      <path stroke="#bec8cb" strokeWidth="5" d="M625 285h230" />
      <path fill="#cad1d3" d="M590 65h300v20H590zM590 65h15v375h-15zM875 65h15v375h-15z" />
      <path fill="#52616b" d="M706 36h72v22h-72z" /><path fill="#b4d1b8" d="m731 44 10 8 10-8z" />
      <path fill="#74838b" d="M915 225h28v72h-28z" /><circle cx="929" cy="245" r="6" fill="#e4dac1" /><circle cx="929" cy="276" r="6" fill="#c1c9c9" />
    </svg>
    <div className="elevator-doors"><div className="elevator-door elevator-door--left" /><div className="elevator-door elevator-door--right" /></div>
    <div className="elevator-player"><RiveCharacter {...player} side="left" facing={action === 'leave' ? 'left' : 'right'} action={action === 'enter' || action === 'leave' ? 'walk' : calling ? 'talk' : 'idle'} /></div>
    {calling ? <div className="elevator-phone"><span>{phoneLabel}</span><svg viewBox="0 0 100 100"><circle className="call-pulse" cx="50" cy="50" r="38" fill="none" stroke="#79ad98" strokeWidth="4" /><path fill="#79ad98" d="m25 25 15-5 10 20-10 8q5 12 17 17l8-10 20 10-5 15q-15 9-39-15T25 25z" /></svg></div> : null}
    <div className="marmot-path">
      <svg className="marmot" viewBox="0 0 180 100">
        <path fill="#695440" d="M45 60Q10 28 6 48T42 81z" />
        <g className="marmot-legs" fill="#554434"><path d="m47 65-6 26h24l-2-28zm62-3 3 29h24l-13-30z" /></g>
        <ellipse cx="84" cy="55" rx="59" ry="31" fill="#8b7053" />
        <ellipse cx="91" cy="64" rx="42" ry="20" fill="#a88a66" />
        <path fill="#8b7053" d="M117 61q-9-43 20-43 20 2 23 27l17 10q0 16-25 14z" />
        <circle cx="130" cy="22" r="11" fill="#70563f" /><circle cx="131" cy="23" r="6" fill="#a28b70" />
        <ellipse cx="158" cy="56" rx="16" ry="10" fill="#b9a080" /><circle cx="146" cy="40" r="4" fill="#222a2b" /><circle cx="147" cy="39" r="1" fill="#fff" />
        <ellipse cx="174" cy="52" rx="5" ry="4" fill="#3e3731" />
        <path stroke="#554434" strokeWidth="2" d="m156 62 12-1m-7-9-14-4m14 7-15 1" />
      </svg>
    </div>
  </div>;
}
