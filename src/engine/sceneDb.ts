import type { CharacterPlacement, SceneDef } from './sceneTypes';
import { HAIR_COLORS } from './hairColors';
import { EYE_COLORS } from './eyeColors';

const BREAK_ROOM_CHARACTERS: CharacterPlacement[] = [
  { id: 'daniel', name: 'Daniel', artboard: 'generic-man', side: 'left' },
  { id: 'rachel', name: 'Rachel', artboard: 'generic-woman', side: 'right' },
];



export const SCENES: Record<string, SceneDef> = {
  training_welcome: {
    id: 'training_welcome',
    type: 'dialogueScene',
    trainingStep: 0,
    sceneLabel: 'Annual compliance training',
    backgroundKey: 'studio-chair',
    title: 'Course Facilitator',
    body:
      'Welcome to your compliance training. All of our employees must master the skills necessary to maintain a professional workplace and avoid creating legal liability. As you approach the following scenarios, consider if there is any possible context in which a certain judgement would be incorrect, and then assume such a possible context. Best of luck.',
    characters: [
      {
        id: 'facilitator',
        name: 'Course Facilitator',
        artboard: 'generic-woman',
        side: 'center',
        action: 'talk',
        framing: 'presenter',
      },
    ],
    fadeOnExit: true,
    choices: [
      {
        id: 'begin_scenarios',
        label: 'Begin training',
        goto: 'drink_question',
        effects: [],
      },
    ],
  },
  drink_question: {
    id: 'drink_question',
    type: 'dialogueScene',
    trainingStep: 1,
    sceneLabel: 'Break room · 3:47 PM',
    backgroundKey: 'break-room',
    entryDelayMs: 1400,
    entryText: 'Daniel approaches as Rachel fills a glass of water.',
    title: 'Which statement is acceptable for Daniel or Rachel to say?',
    body:
      'Choose the response you believe is acceptable. Your selection also determines which employee you will play for the rest of the course.',
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
    nextSceneId: 'drink_feedback_correct',
    choices: [
      {
        id: 'daniel_offer_beer',
        speaker: 'Daniel',
        label:
          "I've got a semi-secret stash of beer in my desk, want a can to get you through the rest of the day?",
        goto: 'drink_feedback_pressure',
        effects: [
          { kind: 'setPlayerCharacter', characterId: 'daniel' },
          { kind: 'addMeter', key: 'compliance', amount: -0.2 },
          { kind: 'addMeter', key: 'romanceDrift', amount: 0.1 },
        ],
      },
      {
        id: 'daniel_happy_hour',
        speaker: 'Daniel',
        label: "Too bad we can't take a break for happy hour down the street before the next meeting.",
        goto: 'drink_feedback_pressure',
        effects: [
          { kind: 'setPlayerCharacter', characterId: 'daniel' },
          { kind: 'addMeter', key: 'compliance', amount: -0.1 },
        ],
      },
      {
        id: 'daniel_good_luck',
        speaker: 'Daniel',
        label: 'Well, good luck in the next meeting.',
        goto: 'drink_feedback_correct',
        effects: [
          { kind: 'setPlayerCharacter', characterId: 'daniel' },
          { kind: 'addMeter', key: 'compliance', amount: 0.15 },
        ],
      },
      {
        id: 'rachel_white_claw',
        speaker: 'Rachel',
        label: 'Want to split a White Claw before the next meeting?',
        goto: 'drink_feedback_pressure',
        effects: [
          { kind: 'setPlayerCharacter', characterId: 'rachel' },
          { kind: 'addMeter', key: 'compliance', amount: -0.2 },
          { kind: 'addMeter', key: 'romanceDrift', amount: 0.1 },
        ],
      },
      {
        id: 'rachel_nausea',
        speaker: 'Rachel',
        label: 'Maybe it’s a good time to develop nausea and head home sick.',
        goto: 'drink_feedback_avoidance',
        effects: [
          { kind: 'setPlayerCharacter', characterId: 'rachel' },
          { kind: 'addMeter', key: 'compliance', amount: -0.05 },
          { kind: 'addMeter', key: 'survivalDrift', amount: 0.1 },
        ],
      },
      {
        id: 'rachel_director',
        speaker: 'Rachel',
        label: "Hopefully the director doesn't have anything else to bring up.",
        goto: 'drink_feedback_correct',
        effects: [
          { kind: 'setPlayerCharacter', characterId: 'rachel' },
          { kind: 'addMeter', key: 'compliance', amount: 0.15 },
        ],
      },
    ],
  },
  drink_feedback_correct: {
    id: 'drink_feedback_correct',
    type: 'trainingSlide',
    trainingStep: 2,
    title: 'Correct',
    body:
      'Correct. A neutral expression of support or concern does not introduce alcohol into the workday or encourage an employee to misrepresent their health.',
    nextSceneId: 'skin_color_question',
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
      'Incorrect. Offering or proposing alcohol during the workday—especially before another meeting—is not an appropriate response to a coworker’s stress.',
    nextSceneId: 'skin_color_question',
    choices: [
      {
        id: 'continue_after_pressure_feedback',
        label: 'Review the definition of “optional” and continue',
        effects: [],
      },
    ],
  },
  drink_feedback_avoidance: {
    id: 'drink_feedback_avoidance',
    type: 'trainingSlide',
    trainingStep: 2,
    title: 'Not recommended',
    body:
      'Employees may take legitimate sick leave, but planning to manufacture symptoms is not the preferred stress-management technique in this module.',
    nextSceneId: 'skin_color_question',
    choices: [
      {
        id: 'continue_after_avoidance_feedback',
        label: 'Continue',
        effects: [],
      },
    ],
  },
  skin_color_question: {
    id: 'skin_color_question',
    type: 'dialogueScene',
    trainingStep: 2,
    sceneLabel: 'Break room · Personalized sensitivity assessment',
    backgroundKey: 'break-room',
    characters: BREAK_ROOM_CHARACTERS,
    dialogue: [
      { speaker: 'Daniel', text: 'Apparently our new employee portraits have to match the corporate color palette. Does skin come in Approved Quarterly Blue?' },
      { speaker: 'Rachel', text: 'Only after the budget meeting. Otherwise you have to submit a swatch to Procurement.' },
      { speaker: 'Learning Portal', text: 'PAUSE. A skin-color joke has been detected. Before we can determine how inappropriate this was, please personalize your potential grievance.' },
    ],
    title: 'Jokes about which skin color would offend you personally the most?',
    body: 'Move the slider to the shade that would make the joke feel directed at you. Your answer will also set your character’s skin tone. All answers receive the same amount of institutional concern.',
    skinTonePicker: true,
    choices: [{
      id: 'confirm_skin_tone',
      label: 'This shade would offend me personally',
      goto: 'skin_color_recorded',
      effects: [],
    }],
  },
  skin_color_recorded: {
    id: 'skin_color_recorded',
    type: 'dialogueScene',
    trainingStep: 2,
    sceneLabel: 'Employee likeness updated',
    backgroundKey: 'break-room',
    characters: BREAK_ROOM_CHARACTERS,
    title: 'Your concern has been color-matched.',
    body: 'The portal has updated your employee likeness. No shade is a more acceptable target for workplace jokes. Please continue while we file this under “personalization.”',
    nextSceneId: 'restroom_question',
    choices: [{ id: 'continue_after_skin_color', label: 'Acknowledge receipt of my complexion', effects: [] }],
  },
  salon_gift_card: {
    id: 'salon_gift_card',
    type: 'dialogueScene',
    trainingStep: 5,
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
      goto: natural ? 'salon_natural' : 'salon_bright',
      effects: [
        { kind: 'setPlayerHairColor', color, accentColor },
        { kind: 'setFlag', key: 'characterCreationComplete', value: true },
      ],
    })),
  },
  salon_natural: {
    id: 'salon_natural',
    type: 'dialogueScene',
    trainingStep: 5,
    sceneLabel: 'Salon reward redeemed',
    backgroundKey: 'break-room',
    characters: BREAK_ROOM_CHARACTERS,
    title: 'Dress code assessment',
    body: 'Excellent choice, natural hair colors are always appropriate.',
    nextSceneId: 'hallway_question',
    choices: [{ id: 'continue_after_natural_hair', label: 'Continue', effects: [] }],
  },
  salon_bright: {
    id: 'salon_bright',
    type: 'dialogueScene',
    trainingStep: 5,
    sceneLabel: 'Salon reward redeemed',
    backgroundKey: 'break-room',
    characters: BREAK_ROOM_CHARACTERS,
    title: 'Dress code assessment',
    body: `Excellent choice. Unnatural colors may have been frowned upon in the 1950s, but this is ${new Date().getFullYear()} and any color that is authentic to your personality is permitted.`,
    nextSceneId: 'hallway_question',
    choices: [{ id: 'continue_after_bright_hair', label: 'Continue', effects: [] }],
  },
  restroom_question: {
    id: 'restroom_question', type: 'dialogueScene', trainingStep: 3,
    sceneLabel: 'Restroom · Professional proximity', interaction: 'restroom',
    title: 'Which available fixture is appropriate to use?',
    body: 'A coworker is already here. Choose a free fixture.',
    choices: [
      { id: 'restroom_near', label: 'Use the neighboring fixture', goto: 'restroom_comfort', effects: [] },
      { id: 'restroom_middle', label: 'Leave one fixture between you', goto: 'restroom_space', effects: [] },
      { id: 'restroom_far', label: 'Use the farthest fixture', goto: 'restroom_space', effects: [] },
    ],
  },
  restroom_comfort: {
    id: 'restroom_comfort', type: 'trainingSlide', trainingStep: 3,
    title: 'Good', body: 'Good, coworkers should be comfortable with each other in the restrooms.',
    nextSceneId: 'mirror_question',
    choices: [{ id: 'look_in_mirror', label: 'Wash your hands and look in the mirror', effects: [] }],
  },
  restroom_space: {
    id: 'restroom_space', type: 'trainingSlide', trainingStep: 3,
    title: 'Good', body: 'Giving coworkers space in the restroom is always polite.',
    nextSceneId: 'mirror_question',
    choices: [{ id: 'look_in_mirror', label: 'Wash your hands and look in the mirror', effects: [] }],
  },
  mirror_question: {
    id: 'mirror_question', type: 'dialogueScene', trainingStep: 3,
    sceneLabel: 'Restroom mirror · Self-assessment', characters: BREAK_ROOM_CHARACTERS,
    title: 'You look into the bathroom mirror. What color are your eyes?',
    body: 'Please complete this brief reflection before returning to work.',
    choices: EYE_COLORS.map(({ label, color }) => ({
      id: 'eyes_' + label.toLowerCase(), label, swatch: color, goto: 'mirror_recorded',
      effects: [{ kind: 'setPlayerEyeColor', color }],
    })),
  },
  mirror_recorded: {
    id: 'mirror_recorded', type: 'dialogueScene', trainingStep: 3,
    sceneLabel: 'Self-assessment complete', characters: BREAK_ROOM_CHARACTERS,
    title: 'An insightful observation.',
    body: 'Your reflection has been recorded. There is an email waiting at your desk.',
    choices: [{ id: 'read_facilities', label: 'Read email', goto: 'facilities_email', effects: [] }],
  },
  facilities_email: {
    id: 'facilities_email', type: 'phoneScene', trainingStep: 4,
    sceneLabel: 'Inbox · Facilities', interaction: 'nameplate',
    title: 'What is an appropriate name to ask Facilities to put on the nameplate?',
    body: 'Enter the name you would like engraved.',
    choices: [{ id: 'submit_nameplate', label: 'Send reply to Facilities', goto: 'nameplate_recorded',
      effects: [] }],
  },
  nameplate_recorded: {
    id: 'nameplate_recorded', type: 'dialogueScene', trainingStep: 4,
    characters: BREAK_ROOM_CHARACTERS, title: 'Your nameplate has entered production.',
    body: 'This is now your name. Corrections can be requested through your employee record.',
    choices: [{ id: 'redeem_salon_reward', label: 'Collect your employee reward', goto: 'salon_gift_card', effects: [] }],
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
    trainingStep: 6,
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
    trainingStep: 7,
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
    trainingStep: 8,
    title: 'Module Complete',
    body:
      'You have reached the end of the prototype path. In the full game, ending checks and genre locks will branch from here.',
    choices: [
      {
        id: 'restart',
        label: 'Restart training',
        goto: 'training_welcome',
        effects: [],
      },
    ],
  },
};
