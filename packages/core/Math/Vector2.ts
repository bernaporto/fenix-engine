import { Vector2 as ThreeVector2 } from 'three';

export type Vector2String = `Vector2(${number},${number})`;
const VECTOR2_STRING_REGEX = /^Vector2\((?<x>-?\d+\.?\d*),(?<y>-?\d+\.?\d*)\)$/;

export type Vector2 = {
  x: number;
  y: number;
};

const toThreeVector2 = ({ x, y }: Vector2): ThreeVector2 =>
  new ThreeVector2(x, y);

const fromThreeVector2 = ({ x, y }: ThreeVector2): Vector2 => ({ x, y });

export const Vector2 = {
  get up(): Vector2 {
    return fromThreeVector2(new ThreeVector2(0, 1));
  },

  get zero(): Vector2 {
    return Vector2.create();
  },

  get one(): Vector2 {
    return fromThreeVector2(new ThreeVector2(1, 1));
  },

  create: (): Vector2 => fromThreeVector2(new ThreeVector2()),

  copy: (v: Vector2): Vector2 => fromThreeVector2(toThreeVector2(v)),

  distance: (a: Vector2, b: Vector2): number =>
    toThreeVector2(a).distanceTo(toThreeVector2(b)),

  equals: (a: Vector2, b: Vector2): boolean =>
    toThreeVector2(a).equals(toThreeVector2(b)),

  add: (a: Vector2, b: Vector2 | number): Vector2 => {
    const result = toThreeVector2(a);
    return fromThreeVector2(
      typeof b === 'number'
        ? result.addScalar(b)
        : result.add(toThreeVector2(b)),
    );
  },

  subtract: (a: Vector2, b: Vector2 | number): Vector2 => {
    const result = toThreeVector2(a);
    return fromThreeVector2(
      typeof b === 'number'
        ? result.subScalar(b)
        : result.sub(toThreeVector2(b)),
    );
  },

  multiply: (a: Vector2, b: Vector2): Vector2 =>
    fromThreeVector2(toThreeVector2(a).multiply(toThreeVector2(b))),

  multiplyScalar: (a: Vector2, b: number): Vector2 =>
    fromThreeVector2(toThreeVector2(a).multiplyScalar(b)),

  divide: (a: Vector2, b: Vector2): Vector2 =>
    fromThreeVector2(toThreeVector2(a).divide(toThreeVector2(b))),

  divideScalar: (a: Vector2, b: number): Vector2 =>
    fromThreeVector2(toThreeVector2(a).divideScalar(b)),

  dot: (a: Vector2, b: Vector2): number =>
    toThreeVector2(a).dot(toThreeVector2(b)),

  cross: (a: Vector2, b: Vector2): number =>
    toThreeVector2(a).cross(toThreeVector2(b)),

  length: (a: Vector2): number => toThreeVector2(a).length(),

  normalize: (a: Vector2): Vector2 =>
    fromThreeVector2(toThreeVector2(a).normalize()),

  clamp: (a: Vector2, min: Vector2, max: Vector2): Vector2 =>
    fromThreeVector2(
      toThreeVector2(a).clamp(toThreeVector2(min), toThreeVector2(max)),
    ),

  floor: (a: Vector2): Vector2 => fromThreeVector2(toThreeVector2(a).floor()),

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
