import type { CSSProperties, ReactNode } from 'react';
import type { MeterState, SceneDef } from '../engine/sceneTypes';
import { RiveCharacter } from '../rive/RiveCharacter';
import { HallwayStage } from './HallwayStage';
import { MustardStage } from './MustardStage';

interface SceneRootProps {
  scene: SceneDef;
  meters: MeterState;
  playerCharacterId?: 'daniel' | 'rachel' | null;
  playerSkinColor?: string;
  playerHairColor?: string;
  playerEyeColor?: string;
  playerName?: string;
  playerHairAccentColor?: string;
  activeSpeaker?: string;
  entryActive?: boolean;
  children: ReactNode;
}

const BACKGROUNDS: Record<string, string> = {
  'studio-chair': `${import.meta.env.BASE_URL}bg/studio-chair.png`,
  'break-room': `${import.meta.env.BASE_URL}bg/break-room.png`,
};

export function SceneRoot({
  scene,
  meters,
  playerCharacterId,
  playerSkinColor,
  playerHairColor,
  playerEyeColor,
  playerName,
  playerHairAccentColor,
  activeSpeaker,
  entryActive = false,
  children,
}: SceneRootProps) {
  const romanceOverlay = Math.min(1, meters.romanceDrift);
  const heistOverlay = Math.min(1, meters.heistDrift);
  const backgroundImage = scene.backgroundKey ? BACKGROUNDS[scene.backgroundKey] : undefined;

  return (
    <main
      className="scene-root"
      data-background={scene.backgroundKey}
      style={
        {
          ['--romance-overlay' as string]: romanceOverlay,
          ['--heist-overlay' as string]: heistOverlay,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        } as CSSProperties
      }
    >
      <div className="scene-stage">
        {!scene.hallwayAction && !scene.mustardAction ? <div className="scene-title-strip">{scene.sceneLabel ?? 'Workplace conduct'}</div> : null}
        {scene.mustardAction ? <MustardStage key={scene.id} action={scene.mustardAction}
          entryActive={entryActive} playerCharacterId={playerCharacterId} playerName={playerName}
          playerSkinColor={playerSkinColor} playerEyeColor={playerEyeColor}
          playerHairColor={playerHairColor} playerHairAccentColor={playerHairAccentColor}
          appearance={meters.romanceDrift} /> : null}
        {scene.hallwayAction ? <HallwayStage key={scene.id} action={scene.hallwayAction}
          entryActive={entryActive} playerCharacterId={playerCharacterId} playerName={playerName}
          playerSkinColor={playerSkinColor} playerEyeColor={playerEyeColor}
          playerHairColor={playerHairColor} playerHairAccentColor={playerHairAccentColor}
          appearance={meters.romanceDrift} /> : null}
        {scene.characters?.length ? (
          <div className="character-layer" aria-label="Scenario characters">
            {scene.characters.filter((character) => !scene.playerOnly || character.id === playerCharacterId).map((character) => (
              <RiveCharacter
                key={character.id}
                artboard={character.artboard}
                name={character.id === playerCharacterId && playerName ? playerName : character.name}
                side={character.side}
                action={
                  entryActive
                    ? (character.entryAction ?? character.action ?? 'idle')
                    : activeSpeaker === character.name
                      ? 'talk'
                      : (character.action ?? 'idle')
                }
                framing={character.framing}
                appearanceBlend={meters.romanceDrift}
                skinColor={character.id === playerCharacterId ? playerSkinColor : undefined}
                hairColor={character.id === playerCharacterId ? playerHairColor : undefined}
                eyeColor={character.id === playerCharacterId ? playerEyeColor : undefined}
                hairAccentColor={character.id === playerCharacterId ? playerHairAccentColor : undefined}
              />
            ))}
          </div>
        ) : null}
        <div className="dialogue-panel">{children}</div>
      </div>
    </main>
  );
}
