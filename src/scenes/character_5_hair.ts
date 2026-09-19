import type { ScenarioDef } from '../engine/sceneTypes';
import { BREAK_ROOM_CHARACTERS } from './shared';
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
            
            sceneLabel: 'Employee rewards · Final personalization question',
            backgroundKey: 'break-room',
            characters: BREAK_ROOM_CHARACTERS,
            dialogue: [
                { speaker: 'Learning Portal', text: 'Congratulations! You have won a free gift card to a local salon: Split Ends & Benefits.' },
                { speaker: 'Learning Portal', text: 'Your prize covers one hair-color appointment. Please demonstrate your understanding of the dress code before redeeming this entirely spontaneous reward.' },
            ],
            title: 'Which dress-code-appropriate color would you like to dye your hair?',
            body: 'Choose your new hair color to redeem your salon gift card.',
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
            id: 'salon_natural',
            type: 'dialogueScene',
            
            sceneLabel: 'Salon reward redeemed',
            backgroundKey: 'break-room',
            characters: BREAK_ROOM_CHARACTERS,
            title: 'Dress code assessment',
            body: 'Excellent choice, natural hair colors are always appropriate.',
            choices: [{ id: 'continue_after_natural_hair', label: 'Continue', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'hallway', mode: 'required' } },] }],
        },
        salon_bright: {
            id: 'salon_bright',
            type: 'dialogueScene',
            
            sceneLabel: 'Salon reward redeemed',
            backgroundKey: 'break-room',
            characters: BREAK_ROOM_CHARACTERS,
            title: 'Dress code assessment',
            body: `Excellent choice. Unnatural colors may have been frowned upon in the 1950s, but this is ${new Date().getFullYear()} and any color that is authentic to your personality is permitted.`,
            choices: [{ id: 'continue_after_bright_hair', label: 'Continue', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'hallway', mode: 'required' } },] }],
        }
    },
};
export default scene;
