import type { ChoiceDef } from '../engine/sceneTypes';

interface ChoiceListProps {
  choices: ChoiceDef[];
  onChoose: (choiceId: string) => void;
}

export function ChoiceList({ choices, onChoose }: ChoiceListProps) {
  const speakerNames = [...new Set(choices.flatMap((choice) => (choice.speaker ? [choice.speaker] : [])))];

  if (speakerNames.length > 0) {
    return (
      <div className="choice-groups" aria-label="Character responses">
        {speakerNames.map((speaker) => (
          <section className="choice-group" key={speaker} aria-labelledby={`choices-${speaker}`}>
            <h3 id={`choices-${speaker}`}>Play as {speaker}</h3>
            <div className="choice-list">
              {choices
                .filter((choice) => choice.speaker === speaker)
                .map((choice) => (
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
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="choice-list" aria-label="Choices">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          className="choice-button"
          onClick={() => onChoose(choice.id)}
        >
          {choice.swatch ? (
            <span className="skin-tone-swatch" style={{ backgroundColor: choice.swatch }} aria-hidden="true" />
          ) : null}
          {choice.label}
        </button>
      ))}
    </div>
  );
}
