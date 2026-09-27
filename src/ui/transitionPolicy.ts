import type { SceneDef } from '../engine/sceneTypes';

export const FADE_MS = 300;
export function needsEntrance(current: SceneDef, next: SceneDef) {
  return next.entrance === 'fade' || (current.stageKey ?? current.id) !== (next.stageKey ?? next.id);
}
export function isSkipKey(event: Pick<KeyboardEvent, 'key' | 'repeat' | 'ctrlKey' | 'metaKey' | 'altKey'>) {
  return !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey &&
    !['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(event.key) && !/^F\d+$/.test(event.key);
}
