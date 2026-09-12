import { useEffect, useState } from 'react';
import { SCENES } from './engine/sceneDb';
import { createInitialGameState } from './engine/gameState';
import { applyChoice } from './engine/scheduler';
import { ChoiceList } from './ui/ChoiceList';
import { DialogueBox } from './ui/DialogueBox';
import { SceneRoot } from './ui/SceneRoot';
import { TrainingChrome } from './ui/TrainingChrome';
import { SkinToneSlider } from './ui/SkinToneSlider';
import { applyEffects } from './engine/effects';
import { EmployeeRecord } from './ui/EmployeeRecord';
import { Restroom } from './ui/Restroom';

function App() {
  const [game, setGame] = useState(createInitialGameState());
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scene = SCENES[game.currentSceneId];

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
    if (choiceId === 'restart') { setGame(createInitialGameState()); setNameDraft(''); return; }
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
        step={scene.trainingStep ?? 0}
        totalSteps={8}
        playerName={playerName}
        onExitCourse={() => {
          setIsTransitioning(false);
          setGame(createInitialGameState());
        }}
      />
      {game.playerCharacterId ? <button className="record-link" onClick={() => setEditing(true)}>Correct employee record</button> : null}
      {editing ? <EmployeeRecord game={game} onCancel={() => setEditing(false)} onSave={(draft) => {
        setGame(draft); setEditing(false);
      }} /> : <>
      <SceneRoot
        scene={scene}
        meters={game.meters}
        playerCharacterId={game.playerCharacterId}
        playerSkinColor={game.playerSkinColor}
        playerHairColor={game.playerHairColor}
        playerHairAccentColor={game.playerHairAccentColor}
        playerEyeColor={game.playerEyeColor}
        playerName={game.playerName}
        activeSpeaker={currentLine?.speaker}
        entryActive={entryActive}
      >
        {scene.interaction === 'restroom' ? <Restroom male={game.playerCharacterId === 'daniel'} /> : null}
        {scene.interaction === 'nameplate' ? <article className="facilities-email">
          <p><strong>From:</strong> Facilities</p>
          <p><strong>Subject:</strong> Your desk nameplate</p>
          <p>Welcome to your workstation. We are ordering your nameplate plaque.
            Please reply with the name you would like us to engrave.</p>
          <p>Regards,<br />Facilities</p>
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
        {dialogueComplete && scene.skinTonePicker ? (
          <SkinToneSlider initialColor={game.playerSkinColor} onChange={(color) => setGame((previous) =>
            applyEffects(previous, [{ kind: 'setPlayerSkinColor', color }]))} />
        ) : null}
        {dialogueComplete && scene.interaction === 'nameplate' ? <form onSubmit={(event) => {
          event.preventDefault();
          if (!nameDraft.trim()) return;
          setGame((previous) => applyChoice({ ...previous, playerName: nameDraft.trim() }, 'submit_nameplate'));
        }}>
          <label htmlFor="plaque-name">Name for the plaque</label>
          <input id="plaque-name" required maxLength={40} value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
          <button type="submit" disabled={!nameDraft.trim()}>Send reply to Facilities</button>
        </form> : dialogueComplete ? <ChoiceList choices={scene.choices ?? []} onChoose={choose} /> : null}
      </SceneRoot>
      </>}
      <div className="scene-transition" aria-hidden="true" />
    </div>
  );
}

export default App;
