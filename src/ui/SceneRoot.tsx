import type { CSSProperties, ReactNode } from 'react';
import type { MeterState, SceneDef } from '../engine/sceneTypes';
import { RiveCharacter } from '../rive/RiveCharacter';

interface SceneRootProps {
  scene: SceneDef;
  meters: MeterState;
  children: ReactNode;
}

export function SceneRoot({ scene, meters, children }: SceneRootProps) {
  const romanceOverlay = Math.min(1, meters.romanceDrift);
  const heistOverlay = Math.min(1, meters.heistDrift);

  return (
    <main
      className="scene-root"
      style={
        {
          ['--romance-overlay' as string]: romanceOverlay,
          ['--heist-overlay' as string]: heistOverlay,
        } as CSSProperties
      }
    >
      <div className="scene-stage">
        <div className="scene-title-strip">Workplace conduct</div>
        <div className="hud-cluster" aria-label="Drift meters">
          <div className="meter-chip">Compliance {Math.round(meters.compliance * 100)}%</div>
          <div className="meter-chip">Romance Drift {Math.round(meters.romanceDrift * 100)}%</div>
          <div className="meter-chip">Heist Drift {Math.round(meters.heistDrift * 100)}%</div>
          <div className="meter-chip">Survival Drift {Math.round(meters.survivalDrift * 100)}%</div>
        </div>
        {scene.characters?.length ? (
          <div className="character-layer" aria-label="Scenario characters">
            {scene.characters.map((character) => (
              <RiveCharacter
                key={character.id}
                artboard={character.artboard}
                name={character.name}
                side={character.side}
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
