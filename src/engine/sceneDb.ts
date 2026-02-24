import type { SceneDef } from './sceneTypes';

export const SCENES: Record<string, SceneDef> = {
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
        goto: 'training_intro',
        effects: [],
      },
    ],
  },
};

