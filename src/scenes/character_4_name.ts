import type { ScenarioDef } from '../engine/sceneTypes';
import { BREAK_ROOM_CHARACTERS } from './shared';
const scene: ScenarioDef = {
    id: 'character_4_name',
    entryBeat: 'facilities_email',
    creation: true,
    milestone: true,
    beats: {
        facilities_email: {
            id: 'facilities_email', type: 'phoneScene',
            sceneLabel: 'Inbox · Facilities', interaction: 'nameplate',
            // Existing email copy relocated unchanged into the inbox renderer.
            email: { from: 'Facilities', subject: 'Your desk nameplate', body: 'Welcome to your workstation. We are ordering your nameplate plaque. Please reply with the name you would like us to engrave.', signoff: 'Regards,\nFacilities' },
            nameplate: { label: 'Name for the plaque', choiceId: 'submit_nameplate', maxLength: 40 },
            // Prompt and named choices supplied verbatim by the user.
            body: 'You receive an email while diligently laboring at your workstation from facilities, asking what name should go on your name plaque. How do you respond?',
            choices: [
                { id: 'literal_name', label: 'Just put my name in it', nextBeat: 'nameplate_recorded', effects: [{ kind: 'setPlayerName', name: 'Just put my name in it' }] },
                { id: 'slim_shady', label: 'Slim Shady', nextBeat: 'nameplate_recorded', effects: [{ kind: 'setPlayerName', name: 'Slim Shady' }] },
                { id: 'submit_nameplate', label: 'Send reply to Facilities', nextBeat: 'nameplate_recorded', effects: [] },
                { id: 'ignore_email', label: 'Do not respond', nextBeat: 'facilities_followup', effects: [{ kind: 'setPlayerName', name: 'johnny tightlipps', onlyIfEmpty: true }] },
            ],
        },
        facilities_followup: {
            id: 'facilities_followup', type: 'phoneScene', sceneLabel: 'Inbox · Facilities',
            // User explicitly permitted generated, dull Facilities email text.
            email: { from: 'Facilities', subject: 'Your desk nameplate', body: 'We did not receive a response to our nameplate request. We located a preferred name in our records and will use it for production.', signoff: 'Regards,\nFacilities' },
            showRecordedName: true,
            choices: [{ id: 'collect_reward', label: 'Collect your employee reward', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_5_hair', mode: 'required' } }] }],
        },
        nameplate_recorded: {
            id: 'nameplate_recorded', type: 'dialogueScene',
            characters: BREAK_ROOM_CHARACTERS, title: 'Your nameplate has entered production.',
            body: 'This is now your name. Corrections can be requested through your employee record.',
            choices: [{ id: 'redeem_salon_reward', label: 'Collect your employee reward', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_5_hair', mode: 'required' } }] }],
        },
    },
};
// Visual identity persists across local beats and compatible scenario handoffs.
for (const beat of Object.values(scene.beats)) beat.stageKey = 'inbox';
scene.beats.nameplate_recorded.stageKey = 'break-room';
scene.beats.nameplate_recorded.backgroundKey = 'break-room';
export default scene;
