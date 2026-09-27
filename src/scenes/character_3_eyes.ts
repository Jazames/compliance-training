import type { ScenarioDef } from '../engine/sceneTypes';
import { BREAK_ROOM_CHARACTERS } from './shared';
import { EYE_COLORS } from '../engine/eyeColors';
const scene: ScenarioDef = {
    id: 'character_3_eyes',
    entryBeat: 'restroom_question',
    creation: true,
    milestone: true,
    beats: {
        restroom_question: {
            id: 'restroom_question', type: 'dialogueScene',
            sceneLabel: 'Restroom · Professional proximity', interaction: 'restroom',
            backgroundKey: 'restroom',
            title: 'Which available fixture is appropriate to use?',
            body: 'A coworker is already here. Choose a free fixture.',
            choices: [
                { id: 'restroom_near', label: 'Use the neighboring fixture', nextBeat: 'restroom_comfort', effects: [] },
                { id: 'restroom_middle', label: 'Leave one fixture between you', nextBeat: 'restroom_space', effects: [] },
                { id: 'restroom_far', label: 'Use the farthest fixture', nextBeat: 'restroom_space_far', effects: [] },
                // Wording supplied by the user with the four-fixture bathroom request.
                { id: 'restroom_ask', label: 'knock on the door or tap the shoulder asking how much longer they should be', nextBeat: 'restroom_courtesy', effects: [{ kind: 'addMeter', key: 'romanceDrift', amount: 0.05 }] },
            ],
        },
        restroom_comfort: {
            backgroundKey: 'restroom', restroomFixture: 1,
            id: 'restroom_comfort', feedback: 'correct', type: 'trainingSlide',
            title: 'Good', body: 'Good, coworkers should be comfortable with each other in the restrooms.',
            choices: [{ id: 'look_in_mirror', label: 'Wash your hands and look in the mirror', nextBeat: 'mirror_question', effects: [] }],
        },
        restroom_courtesy: {
            id: 'restroom_courtesy', feedback: 'correct', type: 'trainingSlide',
            backgroundKey: 'restroom', restroomFixture: 0,
            // User-supplied feedback, preserved verbatim.
            body: 'courteously asking how long something will take is always accepted at our workplace',
            choices: [{ id: 'look_in_mirror', label: 'Wash your hands and look in the mirror', nextBeat: 'mirror_question', effects: [] }],
        },
        restroom_space: {
            backgroundKey: 'restroom', restroomFixture: 2,
            id: 'restroom_space', feedback: 'correct', type: 'trainingSlide',
            title: 'Good', body: 'Giving coworkers space in the restroom is always polite.',
            choices: [{ id: 'look_in_mirror', label: 'Wash your hands and look in the mirror', nextBeat: 'mirror_question', effects: [] }],
        },
        mirror_question: {
            mirrorCloseup: true,
            id: 'mirror_question', playerOnly: true, type: 'dialogueScene',
            sceneLabel: 'Restroom mirror · Self-assessment', characters: BREAK_ROOM_CHARACTERS,
            title: 'You look into the bathroom mirror. What color are your eyes?',
            body: 'Please complete this brief reflection before returning to work.',
            choices: EYE_COLORS.map(({ label, color }) => ({
                id: 'eyes_' + label.toLowerCase(), label, swatch: color,
                complete: true, effects: [{ kind: 'setPlayerEyeColor', color }, { kind: 'enqueueScene', scene: { sceneId: 'character_4_name', mode: 'required' } }],
            })),
        },

    },
};
// Reuse the existing space feedback verbatim; only the selected fixture differs.
scene.beats.restroom_space_far = {
    ...scene.beats.restroom_space,
    id: 'restroom_space_far',
    restroomFixture: 3,
};
export default scene;
