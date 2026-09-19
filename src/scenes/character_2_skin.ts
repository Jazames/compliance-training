import type { ScenarioDef } from '../engine/sceneTypes';
import { BREAK_ROOM_CHARACTERS } from './shared';
const scene: ScenarioDef = {
    id: 'character_2_skin',
    entryBeat: 'skin_color_question',
    creation: true,
    milestone: true,
    beats: {
        skin_color_question: {
            id: 'skin_color_question',
            type: 'dialogueScene',
            
            sceneLabel: 'Break room · Personalized sensitivity assessment',
            backgroundKey: 'break-room',
            characters: BREAK_ROOM_CHARACTERS,
            dialogue: [
                { speaker: 'Daniel', text: 'Apparently our new employee portraits have to match the corporate color palette. Does skin come in Approved Quarterly Blue?' },
                { speaker: 'Rachel', text: 'Only after the budget meeting. Otherwise you have to submit a swatch to Procurement.' },
                { speaker: 'Learning Portal', text: 'PAUSE. A skin-color joke has been detected. Before we can determine how inappropriate this was, please personalize your potential grievance.' },
            ],
            title: 'Jokes about which skin color would offend you personally the most?',
            body: 'Move the slider to the shade that would make the joke feel directed at you. Your answer will also set your character’s skin tone. All answers receive the same amount of institutional concern.',
            skinTonePicker: true,
            choices: [{
                    id: 'confirm_skin_tone',
                    label: 'This shade would offend me personally',
                    nextBeat: 'skin_color_recorded', effects: [],
                }],
        },
        skin_color_recorded: {
            id: 'skin_color_recorded',
            type: 'dialogueScene',
            
            sceneLabel: 'Employee likeness updated',
            backgroundKey: 'break-room',
            characters: BREAK_ROOM_CHARACTERS,
            title: 'Your concern has been color-matched.',
            body: 'The portal has updated your employee likeness. No shade is a more acceptable target for workplace jokes. Please continue while we file this under “personalization.”',
            choices: [{ id: 'continue_after_skin_color', label: 'Acknowledge receipt of my complexion', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_3_eyes', mode: 'required' } },] }],
        }
    },
};
export default scene;
