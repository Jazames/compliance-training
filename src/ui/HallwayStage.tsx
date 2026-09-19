import { useEffect, useState } from 'react';
import { RiveCharacter } from '../rive/RiveCharacter';
import type { SceneDef } from '../engine/sceneTypes';
import { SceneProp } from './SceneProp';

interface Props {
  action: NonNullable<SceneDef['hallwayAction']>;
  entryActive: boolean;
  playerCharacterId?: 'daniel' | 'rachel' | null;
  playerName?: string;
  playerSkinColor?: string;
  playerEyeColor?: string;
  playerHairColor?: string;
  playerHairAccentColor?: string;
  appearance: number;
}

// Staged transforms are intentionally separate from the Rive asset contract:
// neither Jump nor Pickup exists in the current exported rigs.
export function HallwayStage(props: Props) {
  const [reporting, setReporting] = useState(false);
  useEffect(() => {
    if (props.action !== 'report') return;
    const timer = window.setTimeout(() => setReporting(true), 1700);
    return () => window.clearTimeout(timer);
  }, [props.action]);
  const walking = props.action === 'approach' ? props.entryActive : props.action === 'report' && !reporting;
  return <div className={`hallway-stage hallway-stage--${props.action}`} aria-hidden="true">
    <div className="hallway-door hallway-door--one" />
    <div className="hallway-door hallway-door--two" />
    <div className="hallway-rail" />
    <div className="hallway-player">
      <RiveCharacter artboard={props.playerCharacterId === 'rachel' ? 'generic-woman' : 'generic-man'}
        name={props.playerName ?? ''} side="left" action={walking ? 'walk' : reporting ? 'talk' : 'idle'}
        appearanceBlend={props.appearance} skinColor={props.playerSkinColor} eyeColor={props.playerEyeColor}
        hairColor={props.playerHairColor} hairAccentColor={props.playerHairAccentColor} />
    </div>
    <div className="hallway-tools">
      <SceneProp name="broom" className="hallway-broom" />
      <SceneProp name="mop" className="hallway-mop" />
    </div>
    {props.action === 'report' ? <div className="hallway-manager">
      <RiveCharacter artboard="generic-man" name="" side="right" action={reporting ? 'talk' : 'idle'}
        appearanceBlend={0} outfitPrimaryColor="#7E7967" hairColor="#827D75" />
    </div> : null}
  </div>;
}
