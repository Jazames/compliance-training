import type { ScenarioDef } from '../engine/sceneTypes';
const scene: ScenarioDef = {
    id: 'romance_feedback',
    entryBeat: 'drink_feedback_romance',
    beats: {
        drink_feedback_romance: {
            id: 'drink_feedback_romance',
            type: 'dialogueScene',
            
            title: 'Not quite',
            body: 'Inventing a couples’ cocktail does not convert romantic pressure into professional development. The Learning Portal has nevertheless recorded “unexpected chemistry.”',
            characters: [
                {
                    id: 'priya',
                    name: 'Priya',
                    artboard: 'generic-woman',
                    side: 'left',
                },
                {
                    id: 'daniel',
                    name: 'Daniel',
                    artboard: 'generic-man',
                    side: 'right',
                },
            ],
            choices: [
                {
                    id: 'continue_after_romance_feedback',
                    label: 'Acknowledge chemistry-related compliance guidance',
                    complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'hallway', mode: 'course' } },],
                },
            ],
        }
    },
};
export default scene;
