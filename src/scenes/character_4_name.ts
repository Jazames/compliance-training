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
            email: { from: 'Facilities', subject: 'Your desk nameplate', body: 'Welcome to your workstation. We are ordering your nameplate plaque. Please reply with the name you would like us to engrave.', signoff: 'Regards,\nFacilities' },
            nameplate: { label: 'Name for the plaque', choiceId: 'submit_nameplate', maxLength: 40 },
            title: 'What is an appropriate name to ask Facilities to put on the nameplate?',
            body: 'Enter the name you would like engraved.',
            choices: [{ id: 'submit_nameplate', label: 'Send reply to Facilities',
                    nextBeat: 'nameplate_recorded', effects: [] }],
        },
        nameplate_recorded: {
            id: 'nameplate_recorded', type: 'dialogueScene', 
            characters: BREAK_ROOM_CHARACTERS, title: 'Your nameplate has entered production.',
            body: 'This is now your name. Corrections can be requested through your employee record.',
            choices: [{ id: 'redeem_salon_reward', label: 'Collect your employee reward', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_5_hair', mode: 'required' } },] }],
        }
    },
};
export default scene;
