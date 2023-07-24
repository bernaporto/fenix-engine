export const clamp = (min: number, max: number, value: number): number =>
  Math.max(min, Math.min(max, value));

export const clamp01 = (value: number): number => clamp(0, 1, value);

export const positive = (value: number): number => Math.max(0, value);

export const negative = (value: number): number => Math.min(0, value);

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const step = (step: number, value: number): number =>
  // WARN: This is a hack to fix floating point errors.
  removeTrailingZeroes(Math.round(value / step) * step);

export const decimals = (decimals: number, value: number): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

export const random = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const remap = (
  value: number,
  min: number,
  max: number,
  newMin = 0,
  newMax = 1,
): number => {
  const percent = (value - min) / (max - min);
  return percent * (newMax - newMin) + newMin;
};

export const radiansToDegrees = (value: number): number =>
  value * (180 / Math.PI);

export const degreesToRadians = (value: number): number =>
  value * (Math.PI / 180);

export const removeTrailingZeroes = (value: number): number =>
  Number(value.toFixed(10));
