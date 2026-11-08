import { describe, expect, it } from 'vitest';
import { Vector2 } from './Vector2';

describe('Vector2', () => {
  it('creates zero vectors and exposes common constants', () => {
    expect(Vector2.create()).toEqual({ x: 0, y: 0 });
    expect(Vector2.zero).toEqual({ x: 0, y: 0 });
    expect(Vector2.one).toEqual({ x: 1, y: 1 });
    expect(Vector2.up).toEqual({ x: 0, y: 1 });
  });

  it('copies vectors without retaining the same object', () => {
    const vector = { x: 1, y: 2 };
    const copy = Vector2.copy(vector);

    expect(copy).toEqual(vector);
    expect(copy).not.toBe(vector);
  });

  it('adds and subtracts vectors or scalars', () => {
    expect(Vector2.add({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({
      x: 4,
      y: 6,
    });
    expect(Vector2.add({ x: 1, y: 2 }, 3)).toEqual({ x: 4, y: 5 });
    expect(Vector2.subtract({ x: 4, y: 6 }, { x: 1, y: 2 })).toEqual({
      x: 3,
      y: 4,
    });
    expect(Vector2.subtract({ x: 4, y: 6 }, 2)).toEqual({ x: 2, y: 4 });
  });

  it('multiplies and divides vectors or scalars', () => {
    expect(Vector2.multiply({ x: 2, y: 3 }, { x: 4, y: 5 })).toEqual({
      x: 8,
      y: 15,
    });
    expect(Vector2.multiplyScalar({ x: 2, y: 3 }, 4)).toEqual({
      x: 8,
      y: 12,
    });
    expect(Vector2.divide({ x: 8, y: 15 }, { x: 2, y: 3 })).toEqual({
      x: 4,
      y: 5,
    });
    expect(Vector2.divideScalar({ x: 8, y: 12 }, 4)).toEqual({
      x: 2,
      y: 3,
    });
  });

  it('calculates dot product, length, and distance', () => {
    expect(Vector2.dot({ x: 1, y: 2 }, { x: 3, y: 4 })).toBe(11);
    expect(Vector2.length({ x: 3, y: 4 })).toBe(5);
    expect(Vector2.distance({ x: 1, y: 2 }, { x: 4, y: 6 })).toBe(5);
  });

  it('normalizes vectors and returns zero for a zero vector', () => {
    expect(Vector2.normalize({ x: 3, y: 4 })).toEqual({ x: 0.6, y: 0.8 });
    expect(Vector2.normalize(Vector2.zero)).toEqual(Vector2.zero);
  });

  it('compares, clamps, and floors vectors', () => {
    expect(Vector2.equals({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
    expect(Vector2.equals({ x: 1, y: 2 }, { x: 1, y: 3 })).toBe(false);
    expect(
      Vector2.clamp({ x: -1, y: 5 }, { x: 0, y: 1 }, { x: 3, y: 4 }),
    ).toEqual({
      x: 0,
      y: 4,
    });
    expect(Vector2.floor({ x: 1.8, y: -2.2 })).toEqual({ x: 1, y: -3 });
  });

  it('serializes and parses vectors', () => {
    const vector = { x: -1.5, y: 2 };

    expect(Vector2.toString(vector)).toBe('Vector2(-1.5,2)');
    expect(Vector2.fromString('Vector2(-1.5,2)')).toEqual(vector);
  });
});
