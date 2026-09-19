import type { ScenarioDef } from '../engine/sceneTypes';
const scene: ScenarioDef = {
    id: 'character_1_sex',
    entryBeat: 'drink_question',
    creation: true,
    milestone: true,
    beats: {
        drink_question: {
            id: 'drink_question',
            type: 'dialogueScene',
            
            sceneLabel: 'Break room · 3:47 PM',
            backgroundKey: 'break-room',
            entryDelayMs: 1400,
            entryText: 'Daniel approaches as Rachel fills a glass of water.',
            title: 'Which statement is acceptable for Daniel or Rachel to say?',
            body: 'Choose the response you believe is acceptable. Your selection also determines which employee you will play for the rest of the course.',
            dialogue: [
                { speaker: 'Rachel', text: 'Exciting day, huh?' },
                {
                    speaker: 'Daniel',
                    text: "Yeah, I haven't been this stressed since the restructuring announcement.",
                },
                { speaker: 'Rachel', text: 'Definitely a high cortisol day.' },
            ],
            characters: [
                {
                    id: 'daniel',
                    name: 'Daniel',
                    artboard: 'generic-man',
                    side: 'left',
                    entryAction: 'walk',
                },
                {
                    id: 'rachel',
                    name: 'Rachel',
                    artboard: 'generic-woman',
                    side: 'right',
                },
            ],
            choices: [
                {
                    id: 'daniel_offer_beer',
                    speaker: 'Daniel',
                    label: "I've got a semi-secret stash of beer in my desk, want a can to get you through the rest of the day?",
                    nextBeat: 'drink_feedback_pressure', effects: [
                        { kind: 'setPlayerCharacter', characterId: 'daniel' },
                        { kind: 'addMeter', key: 'compliance', amount: -0.2 },
                        { kind: 'addMeter', key: 'romanceDrift', amount: 0.1 },
                    ],
                },
                {
                    id: 'daniel_happy_hour',
                    speaker: 'Daniel',
                    label: "Too bad we can't take a break for happy hour down the street before the next meeting.",
                    nextBeat: 'drink_feedback_pressure', effects: [
                        { kind: 'setPlayerCharacter', characterId: 'daniel' },
                        { kind: 'addMeter', key: 'compliance', amount: -0.1 },
                    ],
                },
                {
                    id: 'daniel_good_luck',
                    speaker: 'Daniel',
                    label: 'Well, good luck in the next meeting.',
                    nextBeat: 'drink_feedback_correct', effects: [
                        { kind: 'setPlayerCharacter', characterId: 'daniel' },
                        { kind: 'addMeter', key: 'compliance', amount: 0.15 },
                    ],
                },
                {
                    id: 'rachel_white_claw',
                    speaker: 'Rachel',
                    label: 'Want to split a White Claw before the next meeting?',
                    nextBeat: 'drink_feedback_pressure', effects: [
                        { kind: 'setPlayerCharacter', characterId: 'rachel' },
                        { kind: 'addMeter', key: 'compliance', amount: -0.2 },
                        { kind: 'addMeter', key: 'romanceDrift', amount: 0.1 },
                    ],
                },
                {
                    id: 'rachel_nausea',
                    speaker: 'Rachel',
                    label: 'Maybe it’s a good time to develop nausea and head home sick.',
                    nextBeat: 'drink_feedback_avoidance', effects: [
                        { kind: 'setPlayerCharacter', characterId: 'rachel' },
                        { kind: 'addMeter', key: 'compliance', amount: -0.05 },
                        { kind: 'addMeter', key: 'survivalDrift', amount: 0.1 },
                    ],
                },
                {
                    id: 'rachel_director',
                    speaker: 'Rachel',
                    label: "Hopefully the director doesn't have anything else to bring up.",
                    nextBeat: 'drink_feedback_correct', effects: [
                        { kind: 'setPlayerCharacter', characterId: 'rachel' },
                        { kind: 'addMeter', key: 'compliance', amount: 0.15 },
                    ],
                },
            ],
        },
        drink_feedback_correct: {
            id: 'drink_feedback_correct',
            type: 'trainingSlide',
            
            title: 'Correct',
            body: 'Correct. A neutral expression of support or concern does not introduce alcohol into the workday or encourage an employee to misrepresent their health.',
            choices: [
                {
                    id: 'continue_after_drink_question',
                    label: 'Continue',
                    complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_2_skin', mode: 'required' } },],
                },
            ],
        },
        drink_feedback_pressure: {
            id: 'drink_feedback_pressure',
            type: 'trainingSlide',
            
            title: 'Incorrect',
            body: 'Incorrect. Offering or proposing alcohol during the workday—especially before another meeting—is not an appropriate response to a coworker’s stress.',
            choices: [
                {
                    id: 'continue_after_pressure_feedback',
                    label: 'Review the definition of “optional” and continue',
                    complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_2_skin', mode: 'required' } },],
                },
            ],
        },
        drink_feedback_avoidance: {
            id: 'drink_feedback_avoidance',
            type: 'trainingSlide',
            
            title: 'Not recommended',
            body: 'Employees may take legitimate sick leave, but planning to manufacture symptoms is not the preferred stress-management technique in this module.',
            choices: [
                {
                    id: 'continue_after_avoidance_feedback',
                    label: 'Continue',
                    complete: true, effects: [{ kind: 'enqueueScene', scene: { sceneId: 'character_2_skin', mode: 'required' } },],
                },
            ],
        }
    },
};
export default scene;
