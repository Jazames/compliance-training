import type { ScenarioDef } from '../engine/sceneTypes';
const scene: ScenarioDef = {
    id: 'romance_notification',
    entryBeat: 'romance_ping',
    beats: {
        romance_ping: {
            id: 'romance_ping',
            type: 'phoneScene',
            
            title: 'Company Phone Notification',
            body: 'Unknown Contact: "Your commitment to compliance is... compelling. Meet by the copier?"',
            choices: [
                {
                    id: 'ignore_ping',
                    label: 'Report suspicious text and continue training',
                    complete: true, effects: [{ kind: 'addMeter', key: 'compliance', amount: 0.1 }],
                },
                {
                    id: 'corporate_romance_commit',
                    label: 'Schedule a cross-functional copier alignment sync',
                    complete: true, effects: [
                        { kind: 'setFlag', key: 'romanceCommit', value: true },
                        { kind: 'addMeter', key: 'romanceDrift', amount: 0.6 },
                    ],
                },
            ],
        }
    },
};
export default scene;
