import {
  clamp,
  clamp01,
  decimals,
  degreesToRadians,
  random,
  randomInt,
  remap,
  step,
} from './number';

describe('clamp', () => {
  it.each([
    [0, 1, 0.5, 0.5],
    [0, 1, 2, 1],
    [0, 1, -1, 0],
  ])(
    'should clamp a value between a min and max.',
    (min, max, value, result) => {
      expect(clamp(min, max, value)).toBe(result);
    },
  );
});

describe('clamp01', () => {
  it.each([
    [0.5, 0.5],
    [2, 1],
    [-1, 0],
  ])('should clamp a value between 0 and 1.', (value, result) => {
    expect(clamp01(value)).toBe(result);
  });
});

describe('step', () => {
  it.each([
    [0.1, 0.5, 0.5],
    [0.1, 0.51, 0.5],
    [0.1, 0.59, 0.6],
    [2, 0.5, 0],
  ])('should round a value to the nearest step.', (amount, value, result) => {
    expect(step(amount, value)).toBe(result);
  });
});

describe('decimals', () => {
  it.each([
    [1, 0.123456, 0.1],
    [2, 0.123456, 0.12],
    [3, 0.123456, 0.123],
    [4, 0.123456, 0.1235],
    [5, 0.123456, 0.12346],
    [10, 0.123456, 0.123456],
  ])(
    'should round a value to the provided decimals.',
    (amount, value, result) => {
      expect(decimals(amount, value)).toBe(result);
    },
  );
});

describe('random', () => {
  it('should return a random number between min and max.', () => {
    const result = random(0, 1);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe('randomInt', () => {
  it('should return a random integer between min and max.', () => {
    const result = randomInt(0, 10);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(10);
    expect(result % 1).toBe(0);
  });
});

describe('remap', () => {
  it.each([
    [0, 1, 0, 0, 1, 0],
    [0, 1, 0.5, 0, 1, 0.5],
    [0, 1, 2, 0, 0.5, 1],
    [0, 1, 0, 0, 2, 0],
    [0, 1, 1, 0, 2, 2],
    [0, 1, 2, 0, 2, 4],
    [0, 1, 0, 1, 2, 1],
    [0, 1, 0.5, 1, 2, 1.5],
    [0, 1, 1, 1, 2, 2],
  ])(
    'should remap a value from one range to another.',
    (min, max, value, newMin, newMax, result) => {
      expect(remap(value, min, max, newMin, newMax)).toBe(result);
    },
  );

  it('should remap a value from one range to another with default values (0, 1).', () => {
    expect(remap(2, 0, 4)).toBe(0.5);
  });
});

describe('degreesToRadians', () => {
  it.each([
    [0, 0],
    [90, Math.PI / 2],
    [180, Math.PI],
    [270, (Math.PI * 3) / 2],
    [360, Math.PI * 2],
  ])('should convert a value from degrees to radians.', (value, result) => {
    expect(degreesToRadians(value)).toBe(result);
  });
});
