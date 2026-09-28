import type { ScenarioDef, SceneDef } from '../engine/sceneTypes';

// Prompt and options supplied verbatim by the user for the parking-lot scenario.
const responses = [
  ['ignore', 'Ignore it and go to your car'],
  ['trash', 'Throw it in the trash'],
  ['plug', 'Bring it inside and plug it into your computer to find out who lost it'],
  ['report', 'Turn it into IT saying you found in the parking lot'],
] as const;
const actionBeats = Object.fromEntries(responses.map(([action, label]): [string, SceneDef] => [action, {
  id: action, type: 'dialogueScene', sceneLabel: '', cyberAction: action,
  body: label,
  autoAdvance: { afterMs: 7200, choiceId: 'finish_action' },
  choices: [{ id: 'finish_action', label, complete: true, effects: [
    { kind: 'enqueueScene', scene: { sceneId: 'course_complete', mode: 'course' } },
    ...(action === 'plug' ? [{ kind: 'addMeter', key: 'heistDrift', amount: 1 } as const] : []),
    ...(action === 'report' ? [{ kind: 'addMeter', key: 'compliance', amount: 0.15 } as const] : []),
  ] }],
}]));
const scene: ScenarioDef = {
  id: 'cybersecurity', entryBeat: 'cyber_followup', milestone: true,
  beats: {
    cyber_followup: {
      id: 'cyber_followup', type: 'dialogueScene', sceneLabel: '', cyberAction: 'discover', entryDelayMs: 2600,
      body: "As you're walking out to your car after work, you find a usb thumb drive lying in the parking lot. What do you do?",
      choices: responses.map(([action, label]) => ({ id: action, label, nextBeat: action, effects: [] })),
    },
    ...actionBeats,
  },
};
for (const beat of Object.values(scene.beats)) beat.stageKey = 'cybersecurity';
export default scene;
