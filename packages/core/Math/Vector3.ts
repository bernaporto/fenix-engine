import { lerp } from '@fenix-engine/utilities/misc';

export type Vector3String = `Vector3(${number},${number},${number})`;
const VECTOR3_REGEX = /Vector3\((\d+),(\d+),(\d+)\)/;

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export const Vector3 = {
  get up(): Vector3 {
    return { x: 0, y: 1, z: 0 };
  },

  get zero(): Vector3 {
    return Vector3.create();
  },

  get one(): Vector3 {
    return { x: 1, y: 1, z: 1 };
  },

  create: (): Vector3 => ({
    x: 0,
    y: 0,
    z: 0,
  }),

  copy: (v: Vector3): Vector3 => ({ x: v.x, y: v.y, z: v.z }),

  add: (a: Vector3, b: Vector3 | number): Vector3 => {
    if (typeof b === 'number') {
      return {
        x: a.x + b,
        y: a.y + b,
        z: a.z + b,
      };
    }

    return {
      x: a.x + b.x,
      y: a.y + b.y,
      z: a.z + b.z,
    };
  },

  subtract: (a: Vector3, b: Vector3 | number): Vector3 => {
    if (typeof b === 'number') {
      return {
        x: a.x - b,
        y: a.y - b,
        z: a.z - b,
      };
    }

    return {
      x: a.x - b.x,
      y: a.y - b.y,
      z: a.z - b.z,
    };
  },

  multiply: (a: Vector3, b: Vector3): Vector3 => ({
    x: a.x * b.x,
    y: a.y * b.y,
    z: a.z * b.z,
  }),

  multiplyScalar: (a: Vector3, b: number): Vector3 => ({
    x: a.x * b,
    y: a.y * b,
    z: a.z * b,
  }),

  divide: (a: Vector3, b: Vector3): Vector3 => ({
    x: a.x / b.x,
    y: a.y / b.y,
    z: a.z / b.z,
  }),

  divideScalar: (a: Vector3, b: number): Vector3 => ({
    x: a.x / b,
    y: a.y / b,
    z: a.z / b,
  }),

  dot: (a: Vector3, b: Vector3): number => a.x * b.x + a.y * b.y + a.z * b.z,

  cross: (a: Vector3, b: Vector3): Vector3 => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }),

  length: (a: Vector3): number => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z),

  normalize: (a: Vector3): Vector3 => {
    const length = Vector3.length(a);

    if (length === 0) return Vector3.zero;

    return Vector3.divideScalar(a, length);
  },

  project: (a: Vector3, b: number): Vector3 => {
    return {
      x: Boolean(a.x) ? b : 0,
      y: Boolean(a.y) ? b : 0,
      z: Boolean(a.z) ? b : 0,
    };
  },

  lerp: (a: Vector3, b: Vector3, t: number): Vector3 => {
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      z: lerp(a.z, b.z, t),
    };
  },

  distance: (a: Vector3, b: Vector3): number => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },

  equals: (a: Vector3, b: Vector3): boolean =>
    a.x === b.x && a.y === b.y && a.z === b.z,

  fromString: (s: Vector3String): Vector3 => {
    const match = s.match(VECTOR3_REGEX);

    const strX = match?.groups?.x;
    const strY = match?.groups?.y;
    const strZ = match?.groups?.z;

    if (!strX || !strY || !strZ) {
      throw new Error(`Invalid Vector3 string: ${s}`);
    }

    return {
      x: parseFloat(strX),
      y: parseFloat(strY),
      z: parseFloat(strZ),
    };
  },

  toString: (v: Vector3): Vector3String => `Vector3(${v.x},${v.y},${v.z})`,
};
