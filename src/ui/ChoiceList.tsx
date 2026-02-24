import type { ChoiceDef } from '../engine/sceneTypes';

interface ChoiceListProps {
  choices: ChoiceDef[];
  onChoose: (choiceId: string) => void;
}

export function ChoiceList({ choices, onChoose }: ChoiceListProps) {
  return (
    <div className="choice-list" role="list" aria-label="Choices">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          className="choice-button"
          onClick={() => onChoose(choice.id)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}

