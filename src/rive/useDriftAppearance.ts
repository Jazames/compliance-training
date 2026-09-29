import { useEffect, useRef } from 'react';
import { clampDrift, DRIFT_DURATION_MS, interpolateDrift, type DriftAppearance } from './driftAppearance';

interface NumberProperty { value: number }
interface Instance { number(name: string): NumberProperty | null }
interface CharacterRuntime { viewModelInstance: Instance | null }

/** Only updates bound appearance inputs. Never stops or scrubs action timelines. */
export function useDriftAppearance(rive: CharacterRuntime | null, target: DriftAppearance, playing: boolean) {
  const last = useRef<{ instance: Instance; current: DriftAppearance } | null>(null);
  const { romance, heist, survival } = target;
  useEffect(() => {
    const instance = rive?.viewModelInstance;
    if (!instance) return;
    const to = { romance: clampDrift(romance), heist: clampDrift(heist), survival: clampDrift(survival) };
    const props = [instance.number('numberProperty'), instance.number('heistDrift'), instance.number('survivalDrift')];
    const apply = (value: DriftAppearance) => {
      [value.romance, value.heist, value.survival].forEach((amount, index) => {
        if (props[index]) props[index].value = amount;
      });
      last.current = { instance, current: value };
    };
    // Prepare the complete appearance behind black before releasing readiness.
    if (last.current?.instance !== instance) { apply(to); return; }
    if (!playing) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const settle = () => { cancelAnimationFrame(frame); apply(to); };
    if (reduced.matches) { settle(); return; }
    const from = { ...last.current.current };
    if (Object.keys(from).every(key => Math.abs(from[key as keyof DriftAppearance] - to[key as keyof DriftAppearance]) < 0.0001)) {
      settle(); return;
    }
    let elapsed = 0;
    let previous: number | undefined;
    const advance = (now: number) => {
      // Background tabs must not jump across the entire animation on return.
      if (previous !== undefined && !document.hidden) elapsed += Math.min(64, now - previous);
      previous = now;
      apply(interpolateDrift(from, to, elapsed / DRIFT_DURATION_MS));
      if (elapsed < DRIFT_DURATION_MS) frame = requestAnimationFrame(advance);
    };
    const onPreference = () => { if (reduced.matches) settle(); };
    reduced.addEventListener('change', onPreference);
    frame = requestAnimationFrame(advance);
    return () => { cancelAnimationFrame(frame); reduced.removeEventListener('change', onPreference); };
  }, [rive, romance, heist, survival, playing]);
}
