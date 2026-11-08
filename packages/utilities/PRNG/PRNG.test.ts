import { describe, expect, it, vi } from 'vitest';
import { PRNG } from './PRNG';

describe('PRNG', () => {
  it('should return the same integer for the same seed', () => {
    const first = PRNG.create(12345).int();
    const second = PRNG.create(12345).int();

    expect(first).toBe(second);
  });

  it('should return the same float for the same seed', () => {
    const first = PRNG.create(12345).float();
    const second = PRNG.create(12345).float();

    expect(first).toBe(second);
  });

  it('should return integers within the requested range', () => {
    const first = PRNG.create(12345).rangeInt(1, 10);
    const second = PRNG.create(12345).rangeInt(1, 10);

    expect(first).toBe(second);
    expect(first).toBeGreaterThanOrEqual(1);
    expect(first).toBeLessThan(10);
  });

  it('should choose the same item for the same seed', () => {
    const choices = ['dog', 'cat', 'turtle', 'giraffe', 'elephant'];
    const first = PRNG.create(12345).choices(choices);
    const second = PRNG.create(12345).choices(choices);

    expect(first).toBe(second);
    expect(choices).toContain(first);
  });

  it('should gracefully handle an empty array', () => {
    expect(PRNG.create(12345).choices([])).toBe(null);
  });

  it('should set the seed', () => {
    const prng = PRNG.create(12345);
    prng.seed.set(67890);

    expect(prng.seed.get()).toBe(67890);
  });

  it('should reset the seed', () => {
    const prng = PRNG.create(12345);
    const now = vi.spyOn(Date, 'now').mockReturnValue(1000);
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    prng.seed.reset();

    expect(prng.seed.get()).toBe(500);

    now.mockRestore();
    random.mockRestore();
  });

  it('should use zero as a valid seed', () => {
    const zeroSeed = PRNG.create(0);
    const explicitSeed = PRNG.create();
    explicitSeed.seed.set(0);

    expect(zeroSeed.float()).toBe(explicitSeed.float());
  });
});
