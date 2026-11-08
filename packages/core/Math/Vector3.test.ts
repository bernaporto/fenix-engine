import { describe, expect, it } from 'vitest';
import { Vector3 } from './Vector3';

describe('Vector3', () => {
  it('creates zero vectors and exposes common constants', () => {
    expect(Vector3.create()).toEqual({ x: 0, y: 0, z: 0 });
    expect(Vector3.zero).toEqual({ x: 0, y: 0, z: 0 });
    expect(Vector3.one).toEqual({ x: 1, y: 1, z: 1 });
    expect(Vector3.up).toEqual({ x: 0, y: 1, z: 0 });
  });

  it('copies vectors without retaining the same object', () => {
    const vector = { x: 1, y: 2, z: 3 };
    const copy = Vector3.copy(vector);

    expect(copy).toEqual(vector);
    expect(copy).not.toBe(vector);
  });

  it('adds and subtracts vectors or scalars', () => {
    expect(Vector3.add({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toEqual({
      x: 5,
      y: 7,
      z: 9,
    });
    expect(Vector3.add({ x: 1, y: 2, z: 3 }, 4)).toEqual({
      x: 5,
      y: 6,
      z: 7,
    });
    expect(
      Vector3.subtract({ x: 4, y: 6, z: 8 }, { x: 1, y: 2, z: 3 }),
    ).toEqual({
      x: 3,
      y: 4,
      z: 5,
    });
    expect(Vector3.subtract({ x: 4, y: 6, z: 8 }, 2)).toEqual({
      x: 2,
      y: 4,
      z: 6,
    });
  });

  it('multiplies and divides vectors or scalars', () => {
    expect(
      Vector3.multiply({ x: 2, y: 3, z: 4 }, { x: 4, y: 5, z: 6 }),
    ).toEqual({
      x: 8,
      y: 15,
      z: 24,
    });
    expect(Vector3.multiplyScalar({ x: 2, y: 3, z: 4 }, 2)).toEqual({
      x: 4,
      y: 6,
      z: 8,
    });
    expect(
      Vector3.divide({ x: 8, y: 15, z: 24 }, { x: 2, y: 3, z: 4 }),
    ).toEqual({
      x: 4,
      y: 5,
      z: 6,
    });
    expect(Vector3.divideScalar({ x: 8, y: 12, z: 16 }, 4)).toEqual({
      x: 2,
      y: 3,
      z: 4,
    });
  });

  it('calculates dot product, cross product, length, and distance', () => {
    expect(Vector3.dot({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toBe(32);
    const vector = { x: 1, y: 0, z: 0 };
    expect(Vector3.cross(vector, { x: 0, y: 1, z: 0 })).toEqual({
      x: 0,
      y: 0,
      z: 1,
    });
    expect(vector).toEqual({ x: 1, y: 0, z: 0 });
    expect(Vector3.length({ x: 2, y: 3, z: 6 })).toBe(7);
    expect(Vector3.distance({ x: 1, y: 2, z: 3 }, { x: 4, y: 6, z: 3 })).toBe(
      5,
    );
  });

  it('normalizes vectors and returns zero for a zero vector', () => {
    const normalized = Vector3.normalize({ x: 0, y: 3, z: 4 });

    expect(normalized.x).toBe(0);
    expect(normalized.y).toBeCloseTo(0.6);
    expect(normalized.z).toBeCloseTo(0.8);
    expect(Vector3.normalize(Vector3.zero)).toEqual(Vector3.zero);
  });

  it('compares vectors and interpolates between them', () => {
    expect(Vector3.equals({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })).toBe(
      true,
    );
    expect(Vector3.equals({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 4 })).toBe(
      false,
    );
    expect(
      Vector3.lerp({ x: 0, y: 2, z: 4 }, { x: 10, y: 4, z: 0 }, 0.5),
    ).toEqual({ x: 5, y: 3, z: 2 });
  });

  it('serializes and parses vectors', () => {
    const vector = { x: -1.5, y: 2, z: 3.25 };

    expect(Vector3.toString(vector)).toBe('Vector3(-1.5,2,3.25)');
    expect(Vector3.fromString('Vector3(-1.5,2,3.25)')).toEqual(vector);
  });
});
