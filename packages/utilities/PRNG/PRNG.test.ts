import { PRNG } from './PRNG';

const seed = 12345;

describe('PRNG', () => {
  it('should always return the same integer.', () => {
    PRNG.seed.set(seed);
    const randomInt = PRNG.int();

    expect(randomInt).toBe(6885456471916543);
  });

  it('should always return the same float.', () => {
    PRNG.seed.set(seed);
    const randomFloat = PRNG.float();

    expect(randomFloat).toBe(0.7644392310176045);
  });

  it('should always return the same range.', () => {
    PRNG.seed.set(seed);
    const randomRange = PRNG.range(1, 10);

    expect(randomRange).toBe(7);
  });

  it('should always return the same item from an array.', () => {
    PRNG.seed.set(seed);
    const randomItem = PRNG.choices([
      'dog',
      'cat',
      'turtle',
      'giraffe',
      'elephant',
    ]);

    expect(randomItem).toBe('giraffe');
  });

  it('should gracefully handle an empty array.', () => {
    const randomItem = PRNG.choices([]);

    expect(randomItem).toBe(null);
  });

  it('should set the seed', () => {
    const seed = Date.now() * Math.random();
    PRNG.seed.set(seed);

    expect(PRNG.seed.get()).toBe(seed);
  });

  it('should reset the seed', () => {
    const seed = Date.now() * Math.random();
    PRNG.seed.set(seed);
    PRNG.seed.reset();

    expect(PRNG.seed.get()).not.toBe(seed);
  });
});
