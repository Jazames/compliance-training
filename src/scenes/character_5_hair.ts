import type { ScenarioDef } from '../engine/sceneTypes';
import { HAIR_COLORS } from '../engine/hairColors';
const scene: ScenarioDef = {
    id: 'character_5_hair',
    entryBeat: 'salon_gift_card',
    creation: true,
    milestone: true,
    beats: {
        salon_gift_card: {
            id: 'salon_gift_card',
            type: 'dialogueScene',
            
            sceneLabel: '',
            backgroundKey: 'meeting-room',
            meetingRoom: true,
            // User-supplied raffle wording, preserved verbatim.
            title: 'you won a gift card to the local salon for a free hair coloring in a raffle. Which one of these is an acceptable hair color for work?',

            choices: HAIR_COLORS.map(({ label, color, accentColor, natural }) => ({
                id: `hair_${label.toLowerCase().replaceAll(' ', '_')}`,
                label,
                swatch: color,
                nextBeat: natural ? 'salon_natural' : 'salon_bright',
                effects: [
                    { kind: 'setPlayerHairColor', color, accentColor },
                    { kind: 'setFlag', key: 'characterCreationComplete', value: true },
                ],
            })),
        },
        salon_natural: {
            id: 'salon_natural', feedback: 'correct',
            type: 'dialogueScene',
            
            sceneLabel: 'Salon reward redeemed',
            backgroundKey: 'meeting-room',
            meetingRoom: true,
            title: 'Dress code assessment',
            body: 'Excellent choice, natural hair colors are always appropriate.',
            choices: [{ id: 'continue_after_natural_hair', label: 'Continue', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'hallway', mode: 'required' } },] }],
        },
        salon_bright: {
            id: 'salon_bright', feedback: 'correct',
            type: 'dialogueScene',
            
            sceneLabel: 'Salon reward redeemed',
            backgroundKey: 'meeting-room',
            meetingRoom: true,
            title: 'Dress code assessment',
            body: `Excellent choice. Unnatural colors may have been frowned upon in the 1950s, but this is ${new Date().getFullYear()} and any color that is authentic to your personality is permitted.`,
            choices: [{ id: 'continue_after_bright_hair', label: 'Continue', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'hallway', mode: 'required' } },] }],
        }
    },
};
// Visual identity persists across local beats and compatible scenario handoffs.
for (const beat of Object.values(scene.beats)) beat.stageKey = 'meeting-room';
export default scene;
