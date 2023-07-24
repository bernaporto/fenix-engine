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
};
