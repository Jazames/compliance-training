import type { ReactNode } from 'react';

interface TrainingChromeProps {
  children?: ReactNode;
  step: number;
  totalSteps: number;
  playerName?: string;
  onExitCourse: () => void;
}

export function TrainingChrome({ step, totalSteps, playerName, onExitCourse, children }: TrainingChromeProps) {
  const progress = totalSteps > 0 ? Math.min(1, Math.max(0, step / totalSteps)) : 0;

  return (
    <header className="training-chrome">
      <div>
        <strong>Corporate Learning Portal</strong>
        {playerName ? <span className="player-name">Playing as {playerName}</span> : null}
      </div>
      <div className="training-progress" aria-label={`Training progress ${step} of ${totalSteps}`}>
        <span>
          Step {step}/{totalSteps}
        </span>
        <div className="training-progress__bar" aria-hidden="true">
          <div className="training-progress__fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <button type="button" className="chrome-button" onClick={onExitCourse}>
        Exit course
      </button>
      {children}
    </header>
  );
}
