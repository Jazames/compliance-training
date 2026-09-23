/** Global character idle policy; each mounted character gets an independent clock. */
export const IDLE_ANIMATION = 'Idle and Blink';
export const IDLE_SPEED = 3;
export const IDLE_MIN_DELAY_MS = 15_000;
export const IDLE_MAX_DELAY_MS = 50_000;

export function nextIdleDelay(random = Math.random): number {
  return IDLE_MIN_DELAY_MS + random() * (IDLE_MAX_DELAY_MS - IDLE_MIN_DELAY_MS);
}

export interface IdleClock {
  nextAt: number;
  startedAt: number | null;
}

export function createIdleClock(now: number, random = Math.random): IdleClock {
  return { nextAt: now + nextIdleDelay(random), startedAt: null };
}

export function sampleIdle(clock: IdleClock, now: number): { start: boolean; time: number } {
  const start = clock.startedAt === null && now >= clock.nextAt;
  if (start) clock.startedAt = now;
  return { start, time: clock.startedAt === null ? 0 : (now - clock.startedAt) / 1000 * IDLE_SPEED };
}

export function finishIdle(clock: IdleClock, now: number, random = Math.random) {
  clock.startedAt = null;
  clock.nextAt = now + nextIdleDelay(random);
}
