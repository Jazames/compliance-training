import type { ScenarioDef } from '../engine/sceneTypes';
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
                { id: 'literal_name', label: 'Just put my name in it', complete: true, effects: [{ kind: 'setPlayerName', name: 'Just put my name in it' }, { kind: 'enqueueScene', scene: { sceneId: 'character_5_hair', mode: 'required' } }] },
                { id: 'slim_shady', label: 'Slim Shady', complete: true, effects: [{ kind: 'setPlayerName', name: 'Slim Shady' }, { kind: 'enqueueScene', scene: { sceneId: 'character_5_hair', mode: 'required' } }] },
                { id: 'submit_nameplate', label: 'Send reply to Facilities', complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_5_hair', mode: 'required' } }] },
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
    },
};
// Visual identity persists across local beats and compatible scenario handoffs.
for (const beat of Object.values(scene.beats)) beat.stageKey = 'inbox';
export default scene;
