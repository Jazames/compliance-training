import { useEffect, useState } from 'react';
import type { SceneDef } from '../engine/sceneTypes';
import type { PlayerAppearance } from '../engine/playerAppearance';
import { RiveCharacter } from '../rive/RiveCharacter';
import { useStageRuntime } from './stageContext';

export function CybersecurityStage({ action, player, entryActive }: {
  action: NonNullable<SceneDef['cyberAction']>; player: PlayerAppearance; entryActive: boolean;
}) {
  const { playing } = useStageRuntime();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!playing) return;
    setStep(0);
    const timers = [1200, 3600, 5000].map((delay, index) => window.setTimeout(() => setStep(index + 1), delay));
    return () => timers.forEach(window.clearTimeout);
  }, [action, playing]);
  const indoors = ['plug', 'report', 'inspect', 'photos', 'return', 'desk', 'message'].includes(action);
  const motion = ['inspect', 'photos', 'message'].includes(action) ? 'idle'
    : action === 'return' || action === 'desk' ? (step < 2 ? 'walk' : 'grab') : action === 'discover' ? (entryActive ? 'walk' : 'idle')
    : step === 0 && action !== 'ignore' ? 'grab'
    : step < 2 ? 'walk' : action === 'report' ? 'talk' : action === 'plug' && step === 2 ? 'grab' : 'idle';
  return <div className={`cyber-stage cyber-stage--${action}`} aria-hidden="true">
    <svg className="cyber-backdrop" viewBox="0 0 1000 600" preserveAspectRatio="none">
      <path fill="#b5bec6" d="M0 0h1000v600H0z" />
      <path fill="#8d959a" d="M0 0h280v365H0z" />
      <path fill="#4b626f" stroke="#d4d9d8" strokeWidth="12" d="M55 120h150v245H55z" />
      <path stroke="#cbd6dc" strokeWidth="6" d="M130 125v235m-65-180h130" />
      <path fill="#798376" d="M280 270h720v95H280z" />
      <path fill="#535b61" d="M0 365h1000v235H0z" />
      <path stroke="#d5d3bd" strokeWidth="5" d="m550 405-65 195m380-195 90 195M580 560h290" />
      <g fill="#687e8d" stroke="#35444e" strokeWidth="5">
        <path d="m650 402 32-75h148l55 75 30 12v69H625v-65z" />
        <path fill="#bbcdd3" d="m697 340-21 57h166l-34-57z" />
        <circle fill="#28333a" cx="677" cy="482" r="25" /><circle fill="#28333a" cx="861" cy="482" r="25" />
      </g>
      <g fill="#3c514b" stroke="#243b34" strokeWidth="5">
        <path d="m120 410 10 90h65l10-90z" /><path d="M113 402h98v16h-98z" />
        <path stroke="#72847b" d="M145 432v47m30-47v47" />
      </g>
    </svg>
    <svg className={`cyber-interior${indoors ? ' is-visible' : ''}`} viewBox="0 0 1000 600" preserveAspectRatio="none">
      <path fill="#b7c4c8" d="M0 0h1000v600H0z" /><path fill="#77868c" d="M0 440h1000v160H0z" />
      <path fill="#708b9a" stroke="#e0e6e7" strokeWidth="12" d="M80 65h330v235H80z" />
      <path stroke="#e0e6e7" strokeWidth="8" d="M245 65v235M80 185h330" />
      <path fill="#657681" d="M690 75h200v230H690z" />
      <path stroke="#c3cdd0" strokeWidth="7" d="M715 112h150m-150 35h150m-150 35h150m-150 35h150m-150 35h150" />
      <path fill="#7b6855" d="M535 375h405v25H535zM560 400h18v145h-18zM895 400h18v145h-18z" />
      <path fill="#34434e" d="M750 235h160v110H750zM820 345h20v30h-20zM650 295h60v80h-60z" />
      <path className="cyber-monitor" fill="#718f9c" d="M760 245h140v90H760z" />
      <path stroke="#e0e5df" strokeWidth="4" d="M655 353h16" />
    </svg>
    <div className="cyber-technician"><RiveCharacter artboard="generic-man" name="" side="right" facing="left" appearanceBlend={0} action={action === 'report' && step >= 2 ? 'talk' : 'idle'} outfitPrimaryColor="#697d78" hairColor="#535052" /></div>
    <div className="cyber-player"><RiveCharacter {...player} side="left" facing={action === 'trash' ? 'left' : 'right'} action={motion} /></div>
    {action === 'message' ? <div className="usb-message" aria-hidden="true"><svg viewBox="0 0 180 120"><rect x="2" y="2" width="176" height="116" rx="12" fill="#edf3f4" stroke="#536f7c" strokeWidth="4" /><path className="message-lines" stroke="#8aa0a8" strokeWidth="7" d="M25 28h110M25 48h85M25 68h100" /><path className="message-send" fill="#286d79" d="m110 76 46 15-46 15 7-15z" /></svg></div> : null}
    <svg className="cyber-usb" viewBox="0 0 70 30"><path fill="#c7cdd0" stroke="#34434b" strokeWidth="2" d="M42 6h25v18H42z" /><path fill="#243c50" d="M3 2h44v26H3z" /><path stroke="#667987" strokeWidth="3" d="M54 10v10m7-10v10" /></svg>
  </div>;
}
