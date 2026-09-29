import type { CSSProperties, ReactNode } from 'react';
import type { MeterState, SceneDef } from '../engine/sceneTypes';
import { RiveCharacter } from '../rive/RiveCharacter';
import { HallwayStage } from './HallwayStage';
import { MustardStage } from './MustardStage';
import { CybersecurityStage } from './CybersecurityStage';
import { ElevatorMarmotStage } from './ElevatorMarmotStage';
import { SceneSpider } from './SceneSpider';
import { RestroomOccupant } from './RestroomOccupant';
import { MirrorStage } from './MirrorStage';
import { InboxStage } from './InboxStage';
import { MeetingStage } from './MeetingStage';
import type { PlayerAppearance } from '../engine/playerAppearance';
import { FeedbackSheet } from './FeedbackSheet';
import { useStageRuntime } from './stageContext';
import { BACKGROUNDS } from './stageAssets';
import { DriftContext } from '../rive/driftContext';

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
  const romanceOverlay = playerAppearance.driftAppearance.romance;
  const heistOverlay = playerAppearance.driftAppearance.heist;
  const backgroundImage = scene.backgroundKey ? BACKGROUNDS[scene.backgroundKey] : undefined;

  return (
    <DriftContext.Provider value={playerAppearance.driftAppearance}><main className="scene-layout">
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
            ['--survival-overlay' as string]: playerAppearance.driftAppearance.survival,
            backgroundImage: backgroundImage && !failed.has(backgroundImage) ? `url(${backgroundImage})` : undefined,
          } as CSSProperties
        }
      >
        <div className="survival-atmosphere" aria-hidden="true" />
        <SceneSpider key={spiderVisit} enabled={arachnophobia} eligible={spiderVisit % 2 === 0}
          delayMs={spiderVisit === 0 ? 13_000 : 37_000} />
        <div className="scene-stage">
          {scene.elevatorMarmot ? <ElevatorMarmotStage player={playerAppearance} entryActive={entryActive} action={scene.elevatorAction} phoneLabel={scene.body} /> : null}
          {scene.cyberAction ? <CybersecurityStage action={scene.cyberAction} player={playerAppearance} entryActive={entryActive} /> : null}
          {scene.driveExplorer ? <section className={`drive-explorer${scene.cyberAction === 'photos' ? ' is-browsing' : ''}`} aria-label={scene.driveExplorer.name}>
            <header>{scene.driveExplorer.name}</header>
            <ul>{scene.driveExplorer.folders.map((folder) => <li key={folder} data-photos={folder === 'photos' || undefined} data-system={folder.startsWith('.') || undefined}>
              <svg viewBox="0 0 64 48" aria-hidden="true"><path fill="#c8a252" d="M3 4h23l7 7h28v33H3z" /><path fill="#e2c171" d="M3 17h58l-5 27H3z" /></svg>
              <span>{folder}</span>
            </li>)}{scene.driveExplorer.files?.map(file => <li key={file} data-system="true">
              <svg viewBox="0 0 64 48" aria-hidden="true"><path fill="#e1e7eb" stroke="#82939f" strokeWidth="2" d="M17 2h21l10 10v34H17z" /><path fill="#b5c3cc" d="M38 2v11h10z" /><path stroke="#899ba6" strokeWidth="2" d="M23 23h19M23 29h19M23 35h14" /></svg>
              <span>{file}</span>
            </li>)}</ul>
            {scene.cyberAction === 'photos' ? <div className="drive-photos" aria-hidden="true">{[0, 1, 2].map(index => <svg key={index} viewBox="0 0 160 100"><path fill={['#9db5b8', '#b9aab9', '#c3b292'][index]} d="M0 0h160v100H0z" /><circle cx="120" cy="24" r="12" fill="#e8dfbd" /><path fill="#5c7770" d="m0 100 50-60 35 40 28-28 47 48z" /></svg>)}</div> : null}
          </section> : null}
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
                  driftAppearance={playerAppearance.driftAppearance}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {feedback ? <FeedbackSheet status={feedback} title={feedbackTitle} leaving={leaving}>{children}</FeedbackSheet> : <div className="dialogue-panel">{children}</div>}
    </main></DriftContext.Provider>
  );
}
