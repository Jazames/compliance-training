import type { ScenarioDef } from '../engine/sceneTypes';
const scene: ScenarioDef = {
    id: 'cybersecurity',
    entryBeat: 'cyber_followup',
    milestone: true,
    beats: {
        cyber_followup: {
            id: 'cyber_followup',
            type: 'trainingSlide',
            
            title: 'Cybersecurity Mini-Quiz',
            body: 'Which action best protects sensitive company data?',
            choices: [
                {
                    id: 'mfa',
                    label: 'Use MFA and least-privilege access',
                    complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'course_complete', mode: 'course' } }, { kind: 'addMeter', key: 'compliance', amount: 0.15 }],
                },
                {
                    id: 'bring_usb',
                    label: 'Bring a mysterious USB from the parking lot inside for testing',
                    complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'course_complete', mode: 'course' } }, { kind: 'addMeter', key: 'survivalDrift', amount: 0.25 }],
                },
            ],
        }
    },
};
export default scene;
