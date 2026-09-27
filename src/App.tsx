import { useEffect, useState } from 'react';
import { TOTAL_MILESTONES } from './scenes';
import { createInitialGameState } from './engine/gameState';
import { applyChoice, getCurrentBeat } from './engine/scheduler';
import { evaluateConditions } from './engine/conditions';
import { ChoiceList } from './ui/ChoiceList';
import { DialogueBox } from './ui/DialogueBox';
import { SceneRoot } from './ui/SceneRoot';
import { TrainingChrome } from './ui/TrainingChrome';
import { SkinToneSlider } from './ui/SkinToneSlider';
import { applyEffects } from './engine/effects';
import { CourseMenu } from './ui/CourseMenu';
import { Restroom } from './ui/Restroom';
import { getPlayerAppearance } from './engine/playerAppearance';
import type { SceneDef } from './engine/sceneTypes';
import { useScenePresentation } from './ui/useScenePresentation';

function App() {
  const [game, setGame] = useState(createInitialGameState());
  const [editing, setEditing] = useState(false);
  const [arachnophobia, setArachnophobia] = useState(false);
  const [visit, setVisit] = useState({ sceneId: game.currentSceneId, index: 0 });
  if (visit.sceneId !== game.currentSceneId) {
    setVisit({ sceneId: game.currentSceneId, index: game.currentSceneId === 'welcome' ? 0 : visit.index + 1 });
  }
  const [nameDraft, setNameDraft] = useState('');
  const [eyePreview, setEyePreview] = useState<string>();
  const [feedbackBackground, setFeedbackBackground] = useState<SceneDef>();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const scene = getCurrentBeat(game);

  const presentation = useScenePresentation(scene, editing);

  useEffect(() => {
    if (!scene?.autoAdvance || editing) return;
    const { afterMs, choiceId } = scene.autoAdvance;
    const timer = window.setTimeout(() => setGame((previous) =>
      getCurrentBeat(previous) === scene ? applyChoice(previous, choiceId) : previous), presentation.skipped ? 0 : afterMs);
    return () => window.clearTimeout(timer);
  }, [scene, editing, presentation.skipped]);

  if (!scene) {
    return <div>Missing scene: {game.currentSceneId}</div>;
  }

  const { entryActive, ready: dialogueComplete } = presentation;
  const currentLine = scene.dialogue?.[presentation.speakerIndex];
  const currentSpeaker = currentLine?.speakerRole === 'otherCharacter'
    ? scene.characters?.find((character) => character.id !== game.playerCharacterId)?.name ?? currentLine.speaker
    : currentLine?.speaker;
  const playerName = game.playerName || (game.playerCharacterId
    ? game.playerCharacterId.slice(0, 1).toUpperCase() + game.playerCharacterId.slice(1)
    : undefined);

  const choose = (choiceId: string) => {
    setEyePreview(undefined);
    if (isTransitioning) return;
    if (scene.choices?.find((choice) => choice.id === choiceId)?.restart) setNameDraft('');
    if (!scene.fadeOnExit) {
      const next = applyChoice(game, choiceId);
      setFeedbackBackground(getCurrentBeat(next)?.feedback ? feedbackBackground ?? scene : undefined);
      setGame(next);
      return;
    }

    setIsTransitioning(true);
    window.setTimeout(() => {
      setGame((previous) => applyChoice(previous, choiceId));
      window.setTimeout(() => setIsTransitioning(false), 120);
    }, 480);
  };

  return (
    <div className={`app-shell${isTransitioning ? ' is-transitioning' : ''}`}>
      <TrainingChrome
        step={game.completedMilestones.length}
        totalSteps={TOTAL_MILESTONES}
        playerName={playerName}
        onExitCourse={() => {
          setIsTransitioning(false);
          setEditing(false);
          setNameDraft('');
          setFeedbackBackground(undefined);
          setGame(createInitialGameState());
          setVisit({ sceneId: 'welcome', index: 0 });
        }}
      >
        <CourseMenu game={game} open={editing} onOpenChange={setEditing}
          arachnophobia={arachnophobia} onToggle={() => setArachnophobia((value) => !value)}
          onSave={(draft) => setGame((previous) => ({ ...previous,
            playerName: draft.playerName, playerCharacterId: draft.playerCharacterId,
            playerSkinColor: draft.playerSkinColor, playerEyeColor: draft.playerEyeColor,
            playerHairColor: draft.playerHairColor, playerHairAccentColor: draft.playerHairAccentColor,
          }))} />
      </TrainingChrome>
      {game.routingError ? <p role="alert">{game.routingError} Use Exit course to restart.</p> : null}
      <SceneRoot
        spiderVisit={visit.index}
        arachnophobia={arachnophobia}
        scene={scene.feedback && feedbackBackground ? { ...feedbackBackground, restroomFixture: scene.restroomFixture } : scene}
        feedback={scene.feedback}
        feedbackTitle={scene.title ?? scene.body}
        playerAppearance={{ ...getPlayerAppearance(game), ...(scene.mirrorCloseup && eyePreview ? { eyeColor: eyePreview } : {}) }}
        meters={game.meters}
        playerCharacterId={game.playerCharacterId}
        activeSpeaker={currentSpeaker}
        entryActive={entryActive}
      >

        <div key={scene.id} className={`scene-presentation${presentation.skipped ? ' animations-skipped' : ''}`}>
          <div className="prompt-card">
            {scene.entryText ? <DialogueBox body={scene.entryText} /> : null}
            <DialogueBox title={scene.title} body={scene.body} />
          </div>
          {presentation.lines.map((line, index) => {
            const speaker = line.speakerRole === 'otherCharacter'
              ? scene.characters?.find((character) => character.id !== game.playerCharacterId)?.name ?? line.speaker
              : line.speaker;
            return line.visible ? <section className="dialogue-box streamed-dialogue" key={index}>
              <h2>{speaker.toLowerCase() === game.playerCharacterId ? playerName : speaker}</h2>
              <p><span className="visually-hidden">{line.text}</span><span aria-hidden="true">{line.shown}</span></p>
            </section> : null;
          })}
          <div className="scene-responses" data-ready={dialogueComplete} inert={!dialogueComplete} aria-hidden={!dialogueComplete}>
        {!entryActive && dialogueComplete && scene.skinTonePicker ? (
          <SkinToneSlider key={scene.id} initialColor={game.playerSkinColor} label={scene.skinToneLabel} onChange={(color) => setGame((previous) =>
            applyEffects(previous, [{ kind: 'setPlayerSkinColor', color }]))} />
        ) : null}
        {!entryActive && dialogueComplete && scene.nameplate ? <><ChoiceList choices={(scene.choices ?? []).filter((choice) => choice.id !== scene.nameplate?.choiceId)} onChoose={choose} /><form onSubmit={(event) => {
          event.preventDefault();
          if (!nameDraft.trim() || !scene.nameplate) return;
          const choiceId = scene.nameplate.choiceId;
          setGame((previous) => applyChoice({ ...previous, playerName: nameDraft.trim() }, choiceId));
        }}>
          <label htmlFor="plaque-name">{scene.nameplate.label}</label>
          <input id="plaque-name" required maxLength={scene.nameplate.maxLength} value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
          <button type="submit" disabled={!nameDraft.trim()}>{scene.choices?.find((choice) => choice.id === scene.nameplate?.choiceId)?.label}</button>
        </form></> : !entryActive && dialogueComplete && !scene.autoAdvance ? scene.interaction === 'restroom' ? <Restroom male={game.playerCharacterId === 'daniel'} choices={(scene.choices ?? []).filter((choice) => evaluateConditions(game, choice.conditions))} onChoose={choose} /> : <ChoiceList choices={(scene.choices ?? []).filter((choice) => evaluateConditions(game, choice.conditions))} onChoose={choose}
          onPreview={scene.mirrorCloseup ? (id) => setEyePreview(scene.choices?.find((choice) => choice.id === id)?.swatch) : undefined} /> : null}
          </div>
        </div>
      </SceneRoot>
      <div className="scene-transition" aria-hidden="true" />
    </div>
  );
}

export default App;
