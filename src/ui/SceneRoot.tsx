import type { CSSProperties, ReactNode } from 'react';
import type { MeterState, SceneDef } from '../engine/sceneTypes';
import { RiveCharacter } from '../rive/RiveCharacter';
import { HallwayStage } from './HallwayStage';
import { MustardStage } from './MustardStage';
import { SceneSpider } from './SceneSpider';
import type { PlayerAppearance } from '../engine/playerAppearance';

interface SceneRootProps {
  spiderVisit: number;
  arachnophobia: boolean;
  scene: SceneDef;
  playerAppearance: PlayerAppearance;
  meters: MeterState;
  playerCharacterId?: 'daniel' | 'rachel' | null;
  activeSpeaker?: string;
  entryActive?: boolean;
  children: ReactNode;
}

const BACKGROUNDS: Record<string, string> = {
  'studio-chair': `${import.meta.env.BASE_URL}bg/studio-chair.png`,
  'break-room': `${import.meta.env.BASE_URL}bg/break-room.png`,
};

export function SceneRoot({
  spiderVisit,
  arachnophobia,
  scene,
  playerAppearance,
  meters,
  playerCharacterId,
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
      <SceneSpider key={spiderVisit} enabled={arachnophobia} eligible={spiderVisit % 2 === 0} />
      <div className="scene-stage">
        {!scene.hallwayAction && !scene.mustardAction ? <div className="scene-title-strip">{scene.sceneLabel ?? 'Workplace conduct'}</div> : null}
        {scene.mustardAction ? <MustardStage key={scene.id} action={scene.mustardAction}
          player={playerAppearance}
          entryActive={entryActive} /> : null}
        {scene.hallwayAction ? <HallwayStage key={scene.id} action={scene.hallwayAction}
          player={playerAppearance}
          entryActive={entryActive} /> : null}
        {scene.characters?.length ? (
          <div className="character-layer" aria-label="Scenario characters">
            {scene.characters.filter((character) => !scene.playerOnly || character.id === playerCharacterId).map((character) => (
              <RiveCharacter
                key={character.id}
                {...character.clothing}
                {...(character.id === playerCharacterId ? playerAppearance : {})}
                artboard={character.artboard}
                name={character.id === playerCharacterId && playerAppearance.name ? playerAppearance.name : character.name}
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
              />
            ))}
          </div>
        ) : null}
        <div className="dialogue-panel">{children}</div>
      </div>
    </main>
  );
}
