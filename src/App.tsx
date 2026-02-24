import { useState } from 'react';
import { SCENES } from './engine/sceneDb';
import { createInitialGameState } from './engine/gameState';
import { applyChoice } from './engine/scheduler';
import { ChoiceList } from './ui/ChoiceList';
import { DialogueBox } from './ui/DialogueBox';
import { SceneRoot } from './ui/SceneRoot';
import { TrainingChrome } from './ui/TrainingChrome';

function App() {
  const [game, setGame] = useState(createInitialGameState());
  const scene = SCENES[game.currentSceneId];

  if (!scene) {
    return <div>Missing scene: {game.currentSceneId}</div>;
  }

  return (
    <div className="app-shell">
      <TrainingChrome
        step={scene.trainingStep ?? 0}
        totalSteps={4}
        onExitCourse={() => setGame(createInitialGameState())}
      />
      <SceneRoot scene={scene} meters={game.meters}>
        <DialogueBox title={scene.title} body={scene.body} />
        <ChoiceList
          choices={scene.choices ?? []}
          onChoose={(choiceId) => setGame((prev) => applyChoice(prev, choiceId))}
        />
      </SceneRoot>
    </div>
  );
}

export default App;
