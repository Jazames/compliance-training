import type { CSSProperties, ReactNode } from 'react';
import type { MeterState, SceneDef } from '../engine/sceneTypes';
import { RiveCharacter } from '../rive/RiveCharacter';
import { HallwayStage } from './HallwayStage';
import { MustardStage } from './MustardStage';
import { CybersecurityStage } from './CybersecurityStage';
import { SceneSpider } from './SceneSpider';
import { RestroomOccupant } from './RestroomOccupant';
import { MirrorStage } from './MirrorStage';
import { InboxStage } from './InboxStage';
import { MeetingStage } from './MeetingStage';
import type { PlayerAppearance } from '../engine/playerAppearance';
import { FeedbackSheet } from './FeedbackSheet';
import { useStageRuntime } from './stageContext';
import { BACKGROUNDS } from './stageAssets';

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
  feedback?: SceneDef['feedback'];
  feedbackTitle?: string;
  leaving?: boolean;
}

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
  feedback,
  feedbackTitle,
  leaving,
}: SceneRootProps) {
  const { playing, failed } = useStageRuntime();
  const romanceOverlay = Math.min(1, meters.romanceDrift);
  const heistOverlay = Math.min(1, meters.heistDrift);
  const backgroundImage = scene.backgroundKey ? BACKGROUNDS[scene.backgroundKey] : undefined;

  return (
    <main className="scene-layout">
      <div
        className="scene-root"
        data-background={scene.backgroundKey}
        data-playing={playing}
        data-mirror={scene.mirrorCloseup || undefined}
        data-inbox={!!scene.email || undefined}
        style={
          {
            ['--romance-overlay' as string]: romanceOverlay,
            ['--heist-overlay' as string]: heistOverlay,
            backgroundImage: backgroundImage && !failed.has(backgroundImage) ? `url(${backgroundImage})` : undefined,
          } as CSSProperties
        }
      >
        <SceneSpider key={spiderVisit} enabled={arachnophobia} eligible={spiderVisit % 2 === 0}
          delayMs={spiderVisit === 0 ? 13_000 : 37_000} />
        <div className="scene-stage">
          {scene.cyberAction ? <CybersecurityStage action={scene.cyberAction} player={playerAppearance} entryActive={entryActive} /> : null}
          {scene.email ? <InboxStage email={scene.email} name={scene.showRecordedName ? playerAppearance.name : undefined} /> : null}
          {scene.meetingRoom ? <MeetingStage player={playerAppearance} /> : null}
          {scene.mirrorCloseup ? <MirrorStage player={{ ...playerAppearance, name: playerAppearance.name || scene.characters?.find((character) => character.id === playerCharacterId)?.name || '' }} /> : null}
          {scene.backgroundKey === 'restroom' ? <RestroomOccupant fixture={scene.restroomFixture} player={playerAppearance} /> : null}
          {!scene.hallwayAction && !scene.mustardAction && scene.sceneLabel !== '' ? <div className="scene-title-strip">{scene.sceneLabel ?? 'Workplace conduct'}</div> : null}
          {scene.mustardAction ? <MustardStage action={scene.mustardAction}
            player={playerAppearance}
            entryActive={entryActive} /> : null}
          {scene.hallwayAction ? <HallwayStage action={scene.hallwayAction}
            player={playerAppearance}
            entryActive={entryActive} /> : null}
          {!scene.mirrorCloseup && scene.characters?.length ? (
            <div className="character-layer" aria-label="Scenario characters">
              {scene.characters.filter((character) => !scene.playerOnly || character.id === playerCharacterId).map((character) => (
                <RiveCharacter
                  key={`${character.id}:${character.artboard}`}
                  {...character.clothing}
                  {...(character.id === playerCharacterId ? playerAppearance : {
                    hairColor: character.hairColor,
                    hairAccentColor: character.hairAccentColor,
                    eyeColor: character.eyeColor,
                  })}
                  artboard={character.artboard}
                  name={character.id === playerCharacterId && playerAppearance.name ? playerAppearance.name : character.name}
                  side={character.side}
                  facing={character.facing}
                  seated={character.seated}
                  sittingStyle={character.sittingStyle}
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
        </div>
      </div>
      {feedback ? <FeedbackSheet status={feedback} title={feedbackTitle} leaving={leaving}>{children}</FeedbackSheet> : <div className="dialogue-panel">{children}</div>}
    </main>
  );
}
