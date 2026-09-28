import type { ScenarioDef } from '../engine/sceneTypes';

// Narration and response labels supplied verbatim by the user.
const scene: ScenarioDef = {
  id: 'survival_elevator', entryBeat: 'marmot',
  beats: {
    marmot: {
      id: 'marmot', type: 'dialogueScene', sceneLabel: '',
      stageKey: 'survival-elevator', elevatorMarmot: true, entryDelayMs: 6000,
      body: 'You are standing in the hall by the elevator when you hear a shriek down the hall, then a small mammal runs around the corner into your view at the same time that the elevator doors open. The critter runs across the floor, startling at your presence, then hooks a turn directly into the elevator.',
      choices: [
        { id: 'enter', label: 'Get in the elevator with the creature', complete: true, effects: [] },
        { id: 'facilities', label: 'Call facilities', complete: true, effects: [] },
        { id: 'emergency', label: 'Call 911', complete: true, effects: [] },
        { id: 'leave', label: 'Walk away and pretend you saw nothing.', complete: true, effects: [] },
      ],
    },
  },
};
for (const choice of scene.beats.marmot.choices!) {
  delete choice.complete;
  choice.nextBeat = `action_${choice.id}`;
  scene.beats[choice.nextBeat] = {
    id: choice.nextBeat, type: 'dialogueScene', sceneLabel: '', stageKey: 'survival-elevator',
    elevatorMarmot: true, elevatorAction: choice.id as 'enter' | 'facilities' | 'emergency' | 'leave',
    body: choice.label, autoAdvance: { afterMs: 6500, choiceId: 'finish_action' },
    choices: [{ id: 'finish_action', label: choice.label, complete: true, effects: [] }],
  };
}
export default scene;
