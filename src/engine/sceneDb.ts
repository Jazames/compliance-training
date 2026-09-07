import type { SceneDef } from './sceneTypes';

export const SCENES: Record<string, SceneDef> = {
  drink_question: {
    id: 'drink_question',
    type: 'dialogueScene',
    trainingStep: 1,
    backgroundKey: 'office-social',
    title: 'Knowledge Check 1: Respectful social invitations',
    body:
      'At an optional after-work gathering, Priya is ordering refreshments. She would like to offer her coworker Daniel an alcoholic drink. What is the most appropriate approach?',
    characters: [
      {
        id: 'priya',
        name: 'Priya',
        artboard: 'generic-woman',
        side: 'left',
        pose: 'offer',
      },
      {
        id: 'daniel',
        name: 'Daniel',
        artboard: 'generic-man',
        side: 'right',
        pose: 'idle',
      },
    ],
    nextSceneId: 'drink_feedback_correct',
    choices: [
      {
        id: 'offer_without_pressure',
        label:
          'Offer alcoholic and non-alcoholic options once, make clear there is no pressure, and respect the answer.',
        goto: 'drink_feedback_correct',
        effects: [{ kind: 'addMeter', key: 'compliance', amount: 0.15 }],
      },
      {
        id: 'order_couples_cocktail',
        label:
          'Order two “Conflict of Interest” cocktails and describe them as a team-building exercise.',
        goto: 'drink_feedback_romance',
        effects: [{ kind: 'addMeter', key: 'romanceDrift', amount: 0.35 }],
      },
      {
        id: 'make_it_career_relevant',
        label: 'Mention that participation is optional, but declining may be noted at calibration time.',
        goto: 'drink_feedback_pressure',
        effects: [{ kind: 'addMeter', key: 'heistDrift', amount: 0.2 }],
      },
    ],
  },
  drink_feedback_correct: {
    id: 'drink_feedback_correct',
    type: 'trainingSlide',
    trainingStep: 2,
    title: 'Correct',
    body:
      'A respectful offer gives the other person a genuine choice. Do not pressure them, ask why they declined, or connect drinking to workplace belonging or opportunity.',
    nextSceneId: 'hallway_question',
    choices: [
      {
        id: 'continue_after_drink_question',
        label: 'Continue',
        effects: [],
      },
    ],
  },
  drink_feedback_romance: {
    id: 'drink_feedback_romance',
    type: 'dialogueScene',
    trainingStep: 2,
    title: 'Not quite',
    body:
      'Inventing a couples’ cocktail does not convert romantic pressure into professional development. The Learning Portal has nevertheless recorded “unexpected chemistry.”',
    characters: [
      {
        id: 'priya',
        name: 'Priya',
        artboard: 'generic-woman',
        side: 'left',
      },
      {
        id: 'daniel',
        name: 'Daniel',
        artboard: 'generic-man',
        side: 'right',
      },
    ],
    nextSceneId: 'hallway_question',
    choices: [
      {
        id: 'continue_after_romance_feedback',
        label: 'Acknowledge chemistry-related compliance guidance',
        effects: [],
      },
    ],
  },
  drink_feedback_pressure: {
    id: 'drink_feedback_pressure',
    type: 'trainingSlide',
    trainingStep: 2,
    title: 'Incorrect',
    body:
      'A choice is not voluntary when it carries an implied workplace consequence. Keep alcohol separate from performance, advancement, and team acceptance.',
    nextSceneId: 'hallway_question',
    choices: [
      {
        id: 'continue_after_pressure_feedback',
        label: 'Review the definition of “optional” and continue',
        effects: [],
      },
    ],
  },
  training_intro: {
    id: 'training_intro',
    type: 'trainingSlide',
    trainingStep: 1,
    title: 'Annual Workplace Conduct Refresher',
    body:
      'You are about to begin a short mandatory module. Please answer all prompts in a professional manner.',
    nextSceneId: 'hallway_question',
    choices: [
      {
        id: 'acknowledge',
        label: 'Acknowledge and continue',
        effects: [{ kind: 'addMeter', key: 'compliance', amount: 0.1 }],
      },
      {
        id: 'flirt_with_module',
        label: 'Compliment the training slide on its visual hierarchy',
        effects: [
          { kind: 'addMeter', key: 'romanceDrift', amount: 0.25 },
          {
            kind: 'enqueueEvent',
            event: {
              id: 'romance_interrupt_1',
              kind: 'interruptScene',
              priority: 10,
              payload: { sceneId: 'romance_ping' },
            },
          },
        ],
      },
    ],
  },
  romance_ping: {
    id: 'romance_ping',
    type: 'phoneScene',
    trainingStep: 1,
    title: 'Company Phone Notification',
    body:
      'Unknown Contact: "Your commitment to compliance is... compelling. Meet by the copier?"',
    nextSceneId: 'hallway_question',
    choices: [
      {
        id: 'ignore_ping',
        label: 'Report suspicious text and continue training',
        effects: [{ kind: 'addMeter', key: 'compliance', amount: 0.1 }],
      },
      {
        id: 'corporate_romance_commit',
        label: 'Schedule a cross-functional copier alignment sync',
        effects: [
          { kind: 'setFlag', key: 'romanceCommit', value: true },
          { kind: 'addMeter', key: 'romanceDrift', amount: 0.6 },
        ],
      },
    ],
  },
  hallway_question: {
    id: 'hallway_question',
    type: 'dialogueScene',
    trainingStep: 2,
    title: 'Scenario: Hallway Conversation',
    body:
      'A coworker shares a rumor about payroll access. What is the most appropriate response?',
    nextSceneId: 'cyber_followup',
    choices: [
      {
        id: 'redirect_policy',
        label: 'Redirect to policy and recommend HR/IT channels',
        effects: [{ kind: 'addMeter', key: 'compliance', amount: 0.15 }],
      },
      {
        id: 'ask_for_credentials',
        label: 'Offer to "stress test" payroll security with their password',
        effects: [{ kind: 'addMeter', key: 'heistDrift', amount: 0.35 }],
      },
    ],
  },
  cyber_followup: {
    id: 'cyber_followup',
    type: 'trainingSlide',
    trainingStep: 3,
    title: 'Cybersecurity Mini-Quiz',
    body: 'Which action best protects sensitive company data?',
    nextSceneId: 'course_complete',
    choices: [
      {
        id: 'mfa',
        label: 'Use MFA and least-privilege access',
        effects: [{ kind: 'addMeter', key: 'compliance', amount: 0.15 }],
      },
      {
        id: 'bring_usb',
        label: 'Bring a mysterious USB from the parking lot inside for testing',
        effects: [{ kind: 'addMeter', key: 'survivalDrift', amount: 0.25 }],
      },
    ],
  },
  course_complete: {
    id: 'course_complete',
    type: 'trainingSlide',
    trainingStep: 4,
    title: 'Module Complete',
    body:
      'You have reached the end of the prototype path. In the full game, ending checks and genre locks will branch from here.',
    choices: [
      {
        id: 'restart',
        label: 'Restart training',
        goto: 'drink_question',
        effects: [],
      },
    ],
  },
};
