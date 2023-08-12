import { clamp } from '@fenix-engine/utilities/misc';

export type Vector2String = `Vector2(${number},${number})`;
const VECTOR2_STRING_REGEX = /^Vector2\((?<x>-?\d+\.?\d*),(?<y>-?\d+\.?\d*)\)$/;

export type Vector2 = {
  x: number;
  y: number;
};

export const Vector2 = {
  get up(): Vector2 {
    return { x: 0, y: 1 };
  },

  get zero(): Vector2 {
    return Vector2.create();
  },

  get one(): Vector2 {
    return { x: 1, y: 1 };
  },

  create: (): Vector2 => ({ x: 0, y: 0 }),

  copy: (v: Vector2): Vector2 => ({ x: v.x, y: v.y }),

  add: (a: Vector2, b: Vector2 | number): Vector2 => {
    if (typeof b === 'number') {
      return {
        x: a.x + b,
        y: a.y + b,
      };
    }

    return {
      x: a.x + b.x,
      y: a.y + b.y,
    };
  },

  subtract: (a: Vector2, b: Vector2 | number): Vector2 => {
    if (typeof b === 'number') {
      return {
        x: a.x - b,
        y: a.y - b,
      };
    }

    return {
      x: a.x - b.x,
      y: a.y - b.y,
    };
  },

  multiply: (a: Vector2, b: Vector2): Vector2 => ({
    x: a.x * b.x,
    y: a.y * b.y,
  }),

  multiplyScalar: (a: Vector2, b: number): Vector2 => ({
    x: a.x * b,
    y: a.y * b,
  }),

  divide: (a: Vector2, b: Vector2): Vector2 => ({
    x: a.x / b.x,
    y: a.y / b.y,
  }),

  divideScalar: (a: Vector2, b: number): Vector2 => ({
    x: a.x / b,
    y: a.y / b,
  }),

  dot: (a: Vector2, b: Vector2): number => a.x * b.x + a.y * b.y,

  cross: (a: Vector2, b: Vector2): Vector2 => ({
    x: a.x * b.y - a.y * b.x,
    y: a.y * b.x - a.x * b.y,
  }),

  length: (a: Vector2): number => Math.sqrt(a.x * a.x + a.y * a.y),

  normalize: (a: Vector2): Vector2 => {
    const length = Vector2.length(a);

    return {
      x: a.x / length,
      y: a.y / length,
    };
  },

  clamp: (a: Vector2, min: Vector2, max: Vector2): Vector2 => ({
    x: clamp(min.x, max.x, a.x),
    y: clamp(min.y, max.y, a.y),
  }),

  floor: (a: Vector2): Vector2 => ({
    x: Math.floor(a.x),
    y: Math.floor(a.y),
  }),

  fromString: (s: Vector2String): Vector2 => {
    const match = s.match(VECTOR2_STRING_REGEX);

    const strX = match?.groups?.x;
    const strY = match?.groups?.y;

    if (!strX || !strY) {
      throw new Error(`Invalid Vector2 string: ${s}`);
    }

    return {
      x: parseFloat(strX),
      y: parseFloat(strY),
    };
  },

  toString: (v: Vector2): Vector2String => `Vector2(${v.x},${v.y})`,
};
