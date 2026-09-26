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

function App() {
  const [game, setGame] = useState(createInitialGameState());
  const [editing, setEditing] = useState(false);
  const [arachnophobia, setArachnophobia] = useState(false);
  const [visit, setVisit] = useState({ sceneId: game.currentSceneId, index: 0 });
  if (visit.sceneId !== game.currentSceneId) {
    setVisit({ sceneId: game.currentSceneId, index: game.currentSceneId === 'welcome' ? 0 : visit.index + 1 });
  }
  const [nameDraft, setNameDraft] = useState('');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scene = getCurrentBeat(game);

  useEffect(() => {
    if (!scene) return;

    if (!scene.entryDelayMs) {
      setDialogueIndex(0);
      return;
    }

    setDialogueIndex(-1);
    const timer = window.setTimeout(() => setDialogueIndex(0), scene.entryDelayMs);
    return () => window.clearTimeout(timer);
  }, [scene]);

  useEffect(() => {
    if (!scene?.autoAdvance || editing) return;
    const { afterMs, choiceId } = scene.autoAdvance;
    const timer = window.setTimeout(() => setGame((previous) =>
      getCurrentBeat(previous) === scene ? applyChoice(previous, choiceId) : previous), afterMs);
    return () => window.clearTimeout(timer);
  }, [scene, editing]);

  if (!scene) {
    return <div>Missing scene: {game.currentSceneId}</div>;
  }

  const dialogue = scene.dialogue ?? [];
  const entryActive = dialogueIndex < 0;
  const dialogueComplete = dialogue.length === 0 || dialogueIndex >= dialogue.length;
  const currentLine = !entryActive && !dialogueComplete ? dialogue[dialogueIndex] : undefined;
  const playerName = game.playerName || (game.playerCharacterId
    ? game.playerCharacterId.slice(0, 1).toUpperCase() + game.playerCharacterId.slice(1)
    : undefined);

  const choose = (choiceId: string) => {
    if (isTransitioning) return;
    if (scene.choices?.find((choice) => choice.id === choiceId)?.restart) setNameDraft('');
    if (!scene.fadeOnExit) {
      setGame((previous) => applyChoice(previous, choiceId));
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
        scene={scene}
        playerAppearance={getPlayerAppearance(game)}
        meters={game.meters}
        playerCharacterId={game.playerCharacterId}
        activeSpeaker={currentLine?.speaker}
        entryActive={entryActive}
      >
        {scene.interaction === 'restroom' ? <Restroom male={game.playerCharacterId === 'daniel'} /> : null}
        {scene.email ? <article className="facilities-email">
          <p><strong>From:</strong> {scene.email.from}</p>
          <p><strong>Subject:</strong> {scene.email.subject}</p>
          <p>{scene.email.body}</p>
          <p style={{ whiteSpace: 'pre-line' }}>{scene.email.signoff}</p>
        </article> : null}
        {entryActive ? (
          <DialogueBox title={scene.sceneLabel} body={scene.entryText} />
        ) : currentLine ? (
          <DialogueBox title={currentLine.speaker.toLowerCase() === game.playerCharacterId ? playerName : currentLine.speaker} body={currentLine.text} />
        ) : (
          <DialogueBox title={scene.title} body={scene.body} />
        )}
        {!entryActive && !dialogueComplete ? (
          <button
            type="button"
            className="dialogue-continue"
            onClick={() => setDialogueIndex((index) => index + 1)}
          >
            {dialogueIndex === dialogue.length - 1 ? 'Review responses' : 'Continue'}
          </button>
        ) : null}
        {!entryActive && dialogueComplete && scene.skinTonePicker ? (
          <SkinToneSlider initialColor={game.playerSkinColor} onChange={(color) => setGame((previous) =>
            applyEffects(previous, [{ kind: 'setPlayerSkinColor', color }]))} />
        ) : null}
        {!entryActive && dialogueComplete && scene.nameplate ? <form onSubmit={(event) => {
          event.preventDefault();
          if (!nameDraft.trim() || !scene.nameplate) return;
          const choiceId = scene.nameplate.choiceId;
          setGame((previous) => applyChoice({ ...previous, playerName: nameDraft.trim() }, choiceId));
        }}>
          <label htmlFor="plaque-name">{scene.nameplate.label}</label>
          <input id="plaque-name" required maxLength={scene.nameplate.maxLength} value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
          <button type="submit" disabled={!nameDraft.trim()}>{scene.choices?.find((choice) => choice.id === scene.nameplate?.choiceId)?.label}</button>
        </form> : !entryActive && dialogueComplete && !scene.autoAdvance ? <ChoiceList choices={(scene.choices ?? []).filter((choice) => evaluateConditions(game, choice.conditions))} onChoose={choose} /> : null}
      </SceneRoot>
      <div className="scene-transition" aria-hidden="true" />
    </div>
  );
}

export default App;
