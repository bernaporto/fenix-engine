import { Vector3 as ThreeVector3 } from 'three';

export type Vector3String = `Vector3(${number},${number},${number})`;
const VECTOR3_REGEX =
  /^Vector3\((?<x>-?\d+\.?\d*),(?<y>-?\d+\.?\d*),(?<z>-?\d+\.?\d*)\)$/;

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

const toThreeVector3 = ({ x, y, z }: Vector3): ThreeVector3 =>
  new ThreeVector3(x, y, z);

const fromThreeVector3 = ({ x, y, z }: ThreeVector3): Vector3 => ({ x, y, z });

export const Vector3 = {
  get up(): Vector3 {
    return fromThreeVector3(new ThreeVector3(0, 1, 0));
  },

  get zero(): Vector3 {
    return Vector3.create();
  },

  get one(): Vector3 {
    return fromThreeVector3(new ThreeVector3(1, 1, 1));
  },

  create: (): Vector3 => fromThreeVector3(new ThreeVector3()),

  copy: (v: Vector3): Vector3 => fromThreeVector3(toThreeVector3(v)),

  add: (a: Vector3, b: Vector3 | number): Vector3 => {
    const result = toThreeVector3(a);
    return fromThreeVector3(
      typeof b === 'number'
        ? result.addScalar(b)
        : result.add(toThreeVector3(b)),
    );
  },

  subtract: (a: Vector3, b: Vector3 | number): Vector3 => {
    const result = toThreeVector3(a);
    return fromThreeVector3(
      typeof b === 'number'
        ? result.subScalar(b)
        : result.sub(toThreeVector3(b)),
    );
  },

  multiply: (a: Vector3, b: Vector3): Vector3 =>
    fromThreeVector3(toThreeVector3(a).multiply(toThreeVector3(b))),

  multiplyScalar: (a: Vector3, b: number): Vector3 =>
    fromThreeVector3(toThreeVector3(a).multiplyScalar(b)),

  divide: (a: Vector3, b: Vector3): Vector3 =>
    fromThreeVector3(toThreeVector3(a).divide(toThreeVector3(b))),

  divideScalar: (a: Vector3, b: number): Vector3 =>
    fromThreeVector3(toThreeVector3(a).divideScalar(b)),

  dot: (a: Vector3, b: Vector3): number =>
    toThreeVector3(a).dot(toThreeVector3(b)),

  cross: (a: Vector3, b: Vector3): Vector3 =>
    fromThreeVector3(toThreeVector3(a).cross(toThreeVector3(b))),

  length: (a: Vector3): number => toThreeVector3(a).length(),

  normalize: (a: Vector3): Vector3 =>
    fromThreeVector3(toThreeVector3(a).normalize()),

  lerp: (a: Vector3, b: Vector3, t: number): Vector3 =>
    fromThreeVector3(toThreeVector3(a).lerp(toThreeVector3(b), t)),

  distance: (a: Vector3, b: Vector3): number =>
    toThreeVector3(a).distanceTo(toThreeVector3(b)),

  equals: (a: Vector3, b: Vector3): boolean =>
    toThreeVector3(a).equals(toThreeVector3(b)),

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
