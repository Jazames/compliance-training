import type { ScenarioDef, SceneDef } from '../engine/sceneTypes';

// All displayed copy supplied verbatim by the user on 2026-09-19.
const narration = 'You are walking in an unfamiliar part of the building. You come across a broom and mop strewn across the floor blocking your path. Do you:';
const responses = [
  'Take a big step over the pile.',
  'Pick up the broom and mop and lean them against the wall nearby.',
  'Alert the facilities manager that there is a trip hazard in this hallway.',
];
const actions = ['jump', 'pickup', 'report'] as const;
const actionBeats = Object.fromEntries(actions.map((action, index): [string, SceneDef] => [
  action, {
    id: action, type: 'dialogueScene', backgroundKey: 'hallway',
    hallwayAction: action, body: responses[index],
    autoAdvance: { afterMs: 4800, choiceId: 'finish_action' },
    choices: [{
      id: 'finish_action', label: responses[index], complete: true,
      effects: [{ kind: 'enqueueScene', scene: { sceneId: 'mustard', mode: 'course' } }],
    }],
  },
]));

const scene: ScenarioDef = {
  id: 'hallway',
  entryBeat: 'hallway_question',
  milestone: true,
  beats: {
    hallway_question: {
      id: 'hallway_question', type: 'dialogueScene', backgroundKey: 'hallway',
      hallwayAction: 'approach', entryDelayMs: 2200,
      body: narration,
      choices: actions.map((action, index) => ({
        id: action, label: responses[index], nextBeat: action, effects: [],
      })),
    },
    ...actionBeats,
  },
};
export default scene;
