import { useEffect, useState } from 'react';
import type { SceneDef } from '../engine/sceneTypes';

const CARD_MS = 300;
const CHARACTER_MS = 16;
const LINE_PAUSE_MS = 200;
export function useScenePresentation(scene: SceneDef | undefined, paused: boolean) {
  const key = scene?.id;
  const [clock, setClock] = useState({ key, elapsed: 0, skipped: false });
  const elapsed = clock.key === key ? clock.elapsed : 0;
  const skipped = clock.key === key && clock.skipped;
  const dialogue = scene?.dialogue ?? [];
  const start = (scene?.entryDelayMs ?? 0) + CARD_MS;
  const end = start + dialogue.reduce((sum, line) => sum + Array.from(line.text).length * CHARACTER_MS + LINE_PAUSE_MS, 0);
  const finish = Math.max(end + 240, scene?.autoAdvance?.afterMs ?? 0);
  useEffect(() => {
    let elapsedMs = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) elapsedMs = finish;
    setClock({ key, elapsed: 0, skipped: reduced });
    const timer = window.setInterval(() => {
      if (paused) return;
      elapsedMs += 16;
      setClock((previous) => previous.skipped ? previous : { key, elapsed: elapsedMs, skipped: false });
      if (elapsedMs >= finish) window.clearInterval(timer);
    }, 16);
    const skip = (event: KeyboardEvent) => {
      if (paused || event.repeat || event.ctrlKey || event.metaKey || event.altKey ||
        ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(event.key) ||
        (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]'))) return;
      if (elapsedMs >= finish) return;
      event.preventDefault();
      event.stopPropagation();
      elapsedMs = finish;
      setClock({ key, elapsed: elapsedMs, skipped: true });
    };
    window.addEventListener('keydown', skip, true);
    return () => { window.clearInterval(timer); window.removeEventListener('keydown', skip, true); };
  }, [key, finish, paused]);
  let offset = start;
  let speakerIndex = -1;
  const lines = dialogue.map((line, index) => {
    const letters = Array.from(line.text);
    const count = skipped ? letters.length : Math.max(0, Math.floor((elapsed - offset) / CHARACTER_MS));
    if (!skipped && elapsed >= offset && count < letters.length) speakerIndex = index;
    offset += letters.length * CHARACTER_MS + LINE_PAUSE_MS;
    return { ...line, visible: skipped || elapsed >= offset - letters.length * CHARACTER_MS - LINE_PAUSE_MS,
      shown: letters.slice(0, count).join('') };
  });
  return { lines, speakerIndex, skipped, ready: skipped || elapsed >= end,
    entryActive: !skipped && elapsed < (scene?.entryDelayMs ?? 0) };
}
