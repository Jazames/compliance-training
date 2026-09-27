import type { ScenarioDef } from '../engine/sceneTypes';
import { BREAK_ROOM_CHARACTERS } from './shared';

// Dialogue and slider instruction supplied verbatim by the user on 2026-09-26.
const scene: ScenarioDef = {
    id: 'character_2_skin',
    entryBeat: 'skin_color_question',
    creation: true,
    milestone: true,
    beats: {
        skin_color_question: {
            id: 'skin_color_question',
            type: 'dialogueScene',
            sceneLabel: '',
            backgroundKey: 'break-room',
            characters: BREAK_ROOM_CHARACTERS,
            dialogue: [{
                speaker: 'Daniel',
                speakerRole: 'otherCharacter',
                text: "I can't believe the board is going to appoint a new CFO just to get a higher ESG score by having a racially diverse C-Suite. What skin color do you think the new CFO should have?",
            }],
            skinTonePicker: true,
            skinToneLabel: 'Select the skin color you think the new CFO should have.',
            choices: [{
                id: 'confirm_skin_tone',
                // Confirmation wording supplied verbatim by the user in the same request.
                label: 'this is the ideal skin color of the new cfo',
                complete: true,
                effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_3_eyes', mode: 'required' } }],
            }],
        },
    },
};
export default scene;
