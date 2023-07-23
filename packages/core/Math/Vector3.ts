export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export const Vector3 = {
  create: (): Vector3 => ({
    x: 0,
    y: 0,
    z: 0,
  }),

  copy: (v: Vector3): Vector3 => ({ x: v.x, y: v.y, z: v.z }),

  add: (a: Vector3, b: Vector3): Vector3 => ({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  }),

  addScalar: (a: Vector3, b: number): Vector3 => ({
    x: a.x + b,
    y: a.y + b,
    z: a.z + b,
  }),

  subtract: (a: Vector3, b: Vector3): Vector3 => ({
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  }),

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

    return Vector3.divideScalar(a, length);
  },
};
