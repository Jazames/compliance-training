import type { GameState } from '../engine/gameState';

export interface DriftAppearance { romance: number; heist: number; survival: number }
export const NEUTRAL_DRIFT: DriftAppearance = { romance: 0, heist: 0, survival: 0 };
export const DRIFT_DURATION_MS = 800;
export const clampDrift = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

/** One visual genre owns the face. Fixed tie order keeps reloads reproducible.
 * Locks have precedence; resolving appearance never changes story meters. */
export function resolveDriftAppearance(meters: GameState['meters'], locks: GameState['locks']): DriftAppearance {
  const genres = ['romance', 'heist', 'survival'] as const;
  const locked = genres.find(genre => locks[`${genre}Locked`]);
  const winner = locked ?? genres.reduce((best, genre) =>
    clampDrift(meters[`${genre}Drift`]) > clampDrift(meters[`${best}Drift`]) ? genre : best);
  return { ...NEUTRAL_DRIFT, [winner]: clampDrift(meters[`${winner}Drift`]) };
}

/** Convex interpolation preserves total weight <= 1, including genre changes. */
export function interpolateDrift(from: DriftAppearance, to: DriftAppearance, progress: number): DriftAppearance {
  const t = clampDrift(progress);
  const ease = t * t * (3 - 2 * t);
  return {
    romance: from.romance + (to.romance - from.romance) * ease,
    heist: from.heist + (to.heist - from.heist) * ease,
    survival: from.survival + (to.survival - from.survival) * ease,
  };
}
