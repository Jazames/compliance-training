import { useEffect, useRef, useState } from 'react';
import type { SceneDef } from '../engine/sceneTypes';
import { isSkipKey } from './transitionPolicy';

const CARD_MS = 300;
const CHARACTER_MS = 16;
const LINE_PAUSE_MS = 200;
export function useScenePresentation(scene: SceneDef | undefined, paused: boolean, forceSkip = false) {
  const key = scene?.id;
  const [clock, setClock] = useState({ key, elapsed: 0, skipped: false });
  const elapsed = clock.key === key ? clock.elapsed : 0;
  const skipped = clock.key === key && clock.skipped;
  const dialogue = scene?.dialogue ?? [];
  const start = (scene?.entryDelayMs ?? 0) + CARD_MS;
  const end = start + dialogue.reduce((sum, line) => sum + Array.from(line.text).length * CHARACTER_MS + LINE_PAUSE_MS, 0);
  const finish = Math.max(end + 240, scene?.autoAdvance?.afterMs ?? 0);
  const progress = useRef({ key, elapsed: 0, skipped: false });
  useEffect(() => {
    const skipped = forceSkip || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    progress.current = { key, elapsed: skipped ? finish : 0, skipped };
    setClock(progress.current);
  }, [key, finish, forceSkip]);
  useEffect(() => {
    if (paused) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      progress.current = { ...progress.current, elapsed: Math.min(finish, progress.current.elapsed + now - last) };
      last = now;
      setClock(progress.current);
      if (progress.current.elapsed >= finish) window.clearInterval(timer);
    }, 16);
    const skip = (event: KeyboardEvent) => {
      if (paused || !isSkipKey(event) ||
        (event.target instanceof Element && event.target.closest('header, input, textarea, select, [contenteditable="true"]'))) return;
      if (progress.current.elapsed >= finish) return;
      event.preventDefault();
      event.stopPropagation();
      progress.current = { key, elapsed: finish, skipped: true };
      setClock(progress.current);
    };
    window.addEventListener('keydown', skip, true);
    return () => { window.clearInterval(timer); window.removeEventListener('keydown', skip, true); };
  }, [key, finish, paused, forceSkip]);
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
