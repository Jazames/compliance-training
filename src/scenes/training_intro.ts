import type { ScenarioDef } from '../engine/sceneTypes';
const scene: ScenarioDef = {
    id: 'training_intro',
    entryBeat: 'training_intro',
    beats: {
        training_intro: {
            id: 'training_intro',
            type: 'trainingSlide',
            
            title: 'Annual Workplace Conduct Refresher',
            body: 'You are about to begin a short mandatory module. Please answer all prompts in a professional manner.',
            choices: [
                {
                    id: 'acknowledge',
                    label: 'Acknowledge and continue',
                    complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'hallway', mode: 'course' } }, { kind: 'addMeter', key: 'compliance', amount: 0.1 }],
                },
                {
                    id: 'flirt_with_module',
                    label: 'Compliment the training slide on its visual hierarchy',
                    complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'hallway', mode: 'course' } },
                        { kind: 'addMeter', key: 'romanceDrift', amount: 0.25 },
                        {
                            kind: 'enqueueScene', scene: { sceneId: 'romance_notification', mode: 'optional', priority: 10, oneShotKey: 'romance_ping' },
                        },
                    ],
                },
            ],
        }
    },
};
export default scene;
