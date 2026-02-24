import type { CSSProperties, ReactNode } from 'react';
import type { MeterState, SceneDef } from '../engine/sceneTypes';

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
        <div className="scene-title-strip">{scene.type}</div>
        <div className="hud-cluster" aria-label="Drift meters">
          <div className="meter-chip">Compliance {Math.round(meters.compliance * 100)}%</div>
          <div className="meter-chip">Romance Drift {Math.round(meters.romanceDrift * 100)}%</div>
          <div className="meter-chip">Heist Drift {Math.round(meters.heistDrift * 100)}%</div>
          <div className="meter-chip">Survival Drift {Math.round(meters.survivalDrift * 100)}%</div>
        </div>
        <div className="dialogue-panel">{children}</div>
      </div>
    </main>
  );
}
