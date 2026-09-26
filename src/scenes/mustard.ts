import type { ScenarioDef, SceneDef } from '../engine/sceneTypes';

// User-supplied narration/options, 2026-09-19. Preserve wording; no added dialogue.
const narration = 'You are in the break room when you accidentally spill food noticeably onto your shirt. You have an another shirt on beneath your shirt, and there are other people in room. Do you:';
const responses = [
  'Leave quickly and go home for the rest of the day so you can attempt to prevent your shirt from staining.',
  'Announce to the rest of the room that you just spilled mustard on your shirt, then go about your day normally, making sure to bring up your  clumsiness in every conversation you have until you go home and can change your shirt.',
  "Remove your shirt quickly, hoping the other people don't notice.",
];
const actions = ['leave', 'montage', 'remove'] as const;
const durations = { leave: 4800, montage: 10000, remove: 5800 };
const actionBeats = Object.fromEntries(actions.map((action, index): [string, SceneDef] => [action, {
  id: action, type: 'dialogueScene', backgroundKey: 'mustard-kitchen', mustardAction: action,
  body: responses[index],
  autoAdvance: { afterMs: durations[action], choiceId: 'finish_action' },
  choices: [{ id: 'finish_action', label: responses[index], complete: true,
    effects: [
      ...(action === 'remove' ? [{ kind: 'revealPlayerUndershirt' } as const] : []),
      { kind: 'enqueueScene', scene: { sceneId: 'cybersecurity', mode: 'course' } },
    ] }],
}]));

const scene: ScenarioDef = {
  id: 'mustard', entryBeat: 'mustard_question', milestone: true,
  beats: {
    mustard_question: {
      id: 'mustard_question', type: 'dialogueScene', backgroundKey: 'mustard-kitchen',
      mustardAction: 'spill', entryDelayMs: 3200, body: narration,
      choices: actions.map((action, index) => ({ id: action, label: responses[index], nextBeat: action,
        effects: action === 'remove' ? [{ kind: 'addMeter', key: 'romanceDrift', amount: 0.02 }] : [],
      })),
    },
    ...actionBeats,
  },
};
export default scene;
