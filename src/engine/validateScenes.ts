import type { ScenarioDef } from './sceneTypes';

/** Fail early with author-facing errors rather than strand a player later. */
export function validateScenes(scenes: ScenarioDef[]) {
  const ids = new Set(scenes.map((scene) => scene.id));
  if (ids.size !== scenes.length) throw new Error('Duplicate scene IDs');
  for (const scene of scenes) {
    if (!scene.beats[scene.entryBeat]) throw new Error(`${scene.id}: missing entry beat`);
    const successors = new Set<string>();
    for (const [beatId, beat] of Object.entries(scene.beats)) {
      const choices = beat.choices ?? [];
      if (beat.autoAdvance && (!Number.isFinite(beat.autoAdvance.afterMs) || beat.autoAdvance.afterMs <= 0 ||
        !choices.some((choice) => choice.id === beat.autoAdvance?.choiceId && !choice.conditions?.length))) {
        throw new Error(`${scene.id}/${beatId}: invalid automatic transition`);
      }
      if (new Set(choices.map((choice) => choice.id)).size !== choices.length) {
        throw new Error(`${scene.id}/${beatId}: duplicate choice IDs`);
      }
      if (!choices.length && !scene.terminal) throw new Error(`${scene.id}/${beatId}: no choices`);
      for (const choice of choices) {
        const where = `${scene.id}/${beatId}/${choice.id}`;
        if ([choice.nextBeat, choice.complete, choice.restart].filter(Boolean).length !== 1) {
          throw new Error(`${where}: choose exactly one of nextBeat, complete, restart`);
        }
        if (choice.nextBeat && !scene.beats[choice.nextBeat]) throw new Error(`${where}: unknown beat`);
        const requests = choice.effects.flatMap((effect) => effect.kind === 'enqueueScene' ? [effect.scene] : []);
        for (const request of requests) {
          if (!ids.has(request.sceneId)) throw new Error(`${where}: unknown scene ${request.sceneId}`);
          if (!Number.isFinite(request.priority ?? 0) || !Number.isFinite(request.weight ?? 1) || (request.weight ?? 1) <= 0) {
            throw new Error(`${where}: priority must be finite and weight positive`);
          }
        }
        if (scene.creation) {
          if (choice.restart || (!choice.complete && requests.length) ||
            (choice.complete && (requests.length !== 1 || requests[0].mode !== 'required' || requests[0].conditions?.length))) {
            throw new Error(`${where}: creation must finish with exactly one unconditional required successor`);
          }
          for (const request of requests) successors.add(request.sceneId);
        }
      }
    }
    if (scene.creation && successors.size !== 1) throw new Error(`${scene.id}: creation branches must share one successor`);
  }
}
