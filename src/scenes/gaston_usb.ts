import type { ScenarioDef } from '../engine/sceneTypes';

// Copy supplied by the user in the Gaston USB request; insertion label reused
// unchanged from their preceding parking-lot request.
const insertion = 'Bring it inside and plug it into your computer to find out who lost it';
const scene: ScenarioDef = {
  id: 'gaston_usb', entryBeat: 'plug',
  beats: {
    plug: {
      id: 'plug', type: 'dialogueScene', sceneLabel: '', stageKey: 'cybersecurity', cyberAction: 'plug',
      body: insertion,
      autoAdvance: { afterMs: 7200, choiceId: 'inspect_drive' },
      choices: [{ id: 'inspect_drive', label: insertion, nextBeat: 'inspect',
        effects: [{ kind: 'addMeter', key: 'heistDrift', amount: 0.05 }] }],
    },
    inspect: {
      id: 'inspect', type: 'dialogueScene', sceneLabel: '', stageKey: 'cybersecurity', cyberAction: 'inspect',
      // User-supplied item names preserved exactly; conventional filenames added
      // under their explicit request for common hidden/system files.
      driveExplorer: { name: 'Gaston_portable', folders: ['photos', 'backup', 'for clarissa', '.pycache'],
        files: ['.ds store', 'Thumbs.db', 'desktop.ini'] },
      body: "after plugging in the drive you see that it clearly belongs to Gaston, your coworker. Gaston works in IT on the floor above you, and he's known for being a stickler about cyber security rules. Do you",
      choices: [
        { id: 'photos', label: 'Look through the photos folder on the drive', complete: true, effects: [
          { kind: 'addMeter', key: 'romanceDrift', amount: 0.05 },
          { kind: 'enqueueScene', scene: { sceneId: 'course_complete', mode: 'course' } },
        ] },
        { id: 'return', label: 'Return it back to the parking lot on the ground', complete: true, effects: [
          { kind: 'enqueueScene', scene: { sceneId: 'course_complete', mode: 'course' } },
        ] },
        { id: 'desk', label: "Leave it on Gaston's desk without telling him.", complete: true, effects: [
          { kind: 'addMeter', key: 'heistDrift', amount: 0.05 },
          { kind: 'enqueueScene', scene: { sceneId: 'course_complete', mode: 'course' } },
        ] },
        { id: 'message', label: 'Message Gaston that you found his lost drive.', complete: true, effects: [
          { kind: 'enqueueScene', scene: { sceneId: 'course_complete', mode: 'course' } },
        ] },
      ],
    },
  },
};
// Retain the authored response and its effects, but finish only after its cutaway.
for (const choice of scene.beats.inspect.choices!) {
  const effects = choice.effects;
  choice.effects = effects.filter(effect => effect.kind !== 'enqueueScene');
  delete choice.complete;
  choice.nextBeat = `action_${choice.id}`;
  scene.beats[choice.nextBeat] = {
    id: choice.nextBeat, type: 'dialogueScene', sceneLabel: '', stageKey: 'cybersecurity',
    cyberAction: choice.id as 'photos' | 'return' | 'desk' | 'message', body: choice.label,
    ...(choice.id === 'photos' ? { driveExplorer: scene.beats.inspect.driveExplorer } : {}),
    autoAdvance: { afterMs: 6500, choiceId: 'finish_action' },
    choices: [{ id: 'finish_action', label: choice.label, complete: true,
      effects: effects.filter(effect => effect.kind === 'enqueueScene') }],
  };
}
export default scene;
