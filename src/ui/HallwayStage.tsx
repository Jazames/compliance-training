import { useCallback, useEffect, useState } from 'react';
import { RiveCharacter } from '../rive/RiveCharacter';
import type { SceneDef } from '../engine/sceneTypes';
import { SceneProp } from './SceneProp';
import type { PlayerAppearance } from '../engine/playerAppearance';
import { useStageRuntime } from './stageContext';

interface Props {
  player: PlayerAppearance;
  action: NonNullable<SceneDef['hallwayAction']>;
  entryActive: boolean;
}

// CSS moves the character and tools through the scene; Rive articulates the arm.
export function HallwayStage(props: Props) {
  const { playing } = useStageRuntime();
  const [grabStarted, setGrabStarted] = useState(false);
  const startGrab = useCallback(() => setGrabStarted(true), []);
  const [reporting, setReporting] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (props.action !== 'pickup') setGrabStarted(false);
    setReporting(false);
    if (props.action !== 'report') return;
    const timer = window.setTimeout(() => setReporting(true), 1700);
    return () => window.clearTimeout(timer);
  }, [props.action, playing]);
  const walking = props.action === 'approach' ? props.entryActive : props.action === 'report' && !reporting;
  return <div className={`hallway-stage hallway-stage--${props.action}${grabStarted ? ' is-grabbing' : ''}`} aria-hidden="true">
    <div className="hallway-door hallway-door--one" />
    <div className="hallway-door hallway-door--two" />
    <div className="hallway-rail" />
    <div className="hallway-player">
      <RiveCharacter {...props.player} side="left" action={props.action === 'pickup' ? 'grab' : walking ? 'walk' : reporting ? 'talk' : 'idle'} onGrabStart={startGrab} />
    </div>
    <div className="hallway-tools">
      <SceneProp name="broom" className="hallway-broom" />
      <SceneProp name="mop" className="hallway-mop" />
    </div>
    <div className="hallway-manager" style={{ opacity: props.action === 'report' ? 1 : 0 }}>
      <RiveCharacter artboard="generic-man" name="" side="right" action={reporting ? 'talk' : 'idle'}
        appearanceBlend={0} outfitPrimaryColor="#7E7967" hairColor="#827D75" />
    </div>
  </div>;
}
