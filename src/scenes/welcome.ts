import type { ScenarioDef } from '../engine/sceneTypes';
const scene: ScenarioDef = {
    id: 'welcome',
    entryBeat: 'training_welcome',
    milestone: true,
    beats: {
        training_welcome: {
            id: 'training_welcome',
            type: 'dialogueScene',
            
            sceneLabel: 'Annual compliance training',
            backgroundKey: 'studio-chair',
            title: 'Course Facilitator',
            body: 'Welcome to your compliance training. All of our employees must master the skills necessary to maintain a professional workplace and avoid creating legal liability. As you approach the following scenarios, consider if there is any possible context in which a certain judgement would be incorrect, and then assume such a possible context. Best of luck.',
            characters: [
                {
                    id: 'facilitator',
                    name: 'Course Facilitator',
                    artboard: 'generic-woman',
                    side: 'center',
                    action: 'talk',
                    framing: 'presenter',
                },
            ],
            fadeOnExit: true,
            choices: [
                {
                    id: 'begin_scenarios',
                    label: 'Begin training',
                    complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_1_sex', mode: 'required' } },],
                },
            ],
        }
    },
};
export default scene;
