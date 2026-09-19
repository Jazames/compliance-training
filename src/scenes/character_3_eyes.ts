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
            title: 'Which available fixture is appropriate to use?',
            body: 'A coworker is already here. Choose a free fixture.',
            choices: [
                { id: 'restroom_near', label: 'Use the neighboring fixture', nextBeat: 'restroom_comfort', effects: [] },
                { id: 'restroom_middle', label: 'Leave one fixture between you', nextBeat: 'restroom_space', effects: [] },
                { id: 'restroom_far', label: 'Use the farthest fixture', nextBeat: 'restroom_space', effects: [] },
            ],
        },
        restroom_comfort: {
            id: 'restroom_comfort', type: 'trainingSlide', 
            title: 'Good', body: 'Good, coworkers should be comfortable with each other in the restrooms.',
            choices: [{ id: 'look_in_mirror', label: 'Wash your hands and look in the mirror', nextBeat: 'mirror_question', effects: [] }],
        },
        restroom_space: {
            id: 'restroom_space', type: 'trainingSlide', 
            title: 'Good', body: 'Giving coworkers space in the restroom is always polite.',
            choices: [{ id: 'look_in_mirror', label: 'Wash your hands and look in the mirror', nextBeat: 'mirror_question', effects: [] }],
        },
        mirror_question: {
            id: 'mirror_question', playerOnly: true, type: 'dialogueScene', 
            sceneLabel: 'Restroom mirror · Self-assessment', characters: BREAK_ROOM_CHARACTERS,
            title: 'You look into the bathroom mirror. What color are your eyes?',
            body: 'Please complete this brief reflection before returning to work.',
            choices: EYE_COLORS.map(({ label, color }) => ({
                id: 'eyes_' + label.toLowerCase(), label, swatch: color,
                nextBeat: 'mirror_recorded', effects: [{ kind: 'setPlayerEyeColor', color }],
            })),
        },
        mirror_recorded: {
            id: 'mirror_recorded', playerOnly: true, type: 'dialogueScene', 
            sceneLabel: 'Self-assessment complete', characters: BREAK_ROOM_CHARACTERS,
            title: 'An insightful observation.',
            body: 'Your reflection has been recorded. There is an email waiting at your desk.',
            choices: [{ id: 'read_facilities', label: 'Read email', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_4_name', mode: 'required' } },] }],
        }
    },
};
export default scene;
