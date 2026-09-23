import test from 'node:test';
import assert from 'node:assert/strict';
import { createIdleClock, sampleIdle, finishIdle, nextIdleDelay } from '../src/rive/idlePlayback.ts';

test('idle delay is randomized between 15 and 50 seconds', () => {
  assert.equal(nextIdleDelay(() => 0), 15000);
  assert.equal(nextIdleDelay(() => 0.5), 32500);
  assert.equal(nextIdleDelay(() => 1), 50000);
});

test('idle holds neutral, starts once, and advances at 3x', () => {
  const clock = createIdleClock(100, () => 0);
  assert.deepEqual(sampleIdle(clock, 15099), { start: false, time: 0 });
  assert.deepEqual(sampleIdle(clock, 15100), { start: true, time: 0 });
  const accelerated = sampleIdle(clock, 15300);
  assert.equal(accelerated.start, false);
  assert.ok(Math.abs(accelerated.time - 0.6) < 1e-10);
  assert.deepEqual(sampleIdle(clock, 16100), { start: false, time: 3 });
});

test('one exported cycle resets to neutral and schedules a fresh random interval', () => {
  const clock = createIdleClock(0, () => 0);
  sampleIdle(clock, 15000);
  finishIdle(clock, 15500, () => 1);
  assert.deepEqual(sampleIdle(clock, 65499), { start: false, time: 0 });
  assert.deepEqual(sampleIdle(clock, 65500), { start: true, time: 0 });
});

test('characters have independent clocks and visibility resets do not catch up', () => {
  const first = createIdleClock(0, () => 0);
  const second = createIdleClock(0, () => 1);
  assert.equal(sampleIdle(first, 16000).start, true);
  assert.equal(sampleIdle(second, 16000).start, false);
  finishIdle(first, 100000, () => 0.5);
  assert.deepEqual(sampleIdle(first, 100001), { start: false, time: 0 });
  assert.equal(first.nextAt, 132500);
});
