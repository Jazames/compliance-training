import { useCallback, useEffect, useRef, useState } from 'react';
import type { SceneDef } from '../engine/sceneTypes';
import { FADE_MS, isSkipKey, needsEntrance } from './transitionPolicy';

export function useSceneTransition() {
  const [phase, setPhase] = useState<'prepare' | 'out' | 'in' | 'present'>('prepare');
  const [visit, setVisit] = useState(0);
  const [ready, setReady] = useState(false);
  const [skip, setSkip] = useState(false);
  const busy = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const finishOutgoing = useRef<(() => void) | undefined>(undefined);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reportReady = useCallback((value: boolean) => setReady(value), []);
  const enter = useCallback((current: SceneDef, next: SceneDef, commit: () => void) => {
    if (busy.current) return;
    setSkip(false);
    if (!needsEntrance(current, next)) { commit(); return; }
    busy.current = true;
    setPhase('out');
    finishOutgoing.current = () => {
      finishOutgoing.current = undefined;
      setReady(false);
      setVisit((value) => value + 1);
      setPhase('prepare');
      window.scrollTo({ top: 0, behavior: 'instant' });
      commit();
    };
    timer.current = setTimeout(() => finishOutgoing.current?.(), reduced() ? 0 : FADE_MS);
  }, []);
  const reset = useCallback(() => {
    clearTimeout(timer.current);
    finishOutgoing.current = undefined;
    busy.current = true;
    setSkip(false);
    setReady(false);
    setVisit((value) => value + 1);
    setPhase('prepare');
  }, []);
  useEffect(() => {
    if (phase !== 'prepare' || !ready) return;
    setPhase(skip || reduced() ? 'present' : 'in');
  }, [phase, ready, skip]);
  useEffect(() => {
    if (phase === 'present') { busy.current = false; return; }
    if (phase !== 'in') return;
    const fade = setTimeout(() => setPhase('present'), skip || reduced() ? 0 : FADE_MS);
    return () => clearTimeout(fade);
  }, [phase, skip]);
  useEffect(() => {
    if (phase === 'present') return;
    const listener = (event: KeyboardEvent) => {
      if (!isSkipKey(event) || (event.target instanceof Element && event.target.closest('header, input, textarea, select, [contenteditable="true"]'))) return;
      event.preventDefault(); event.stopPropagation(); setSkip(true);
      if (phase === 'out') { clearTimeout(timer.current); finishOutgoing.current?.(); }
    };
    window.addEventListener('keydown', listener, true);
    return () => window.removeEventListener('keydown', listener, true);
  }, [phase]);
  useEffect(() => () => clearTimeout(timer.current), []);
  return { phase, visit, skip, ready, playing: phase === 'present' && ready, enter, reset, reportReady };
}
