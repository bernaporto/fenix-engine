import { Vector2 } from './Vector2';
import { Vector3 } from './Vector3';

describe('Vectors', () => {
  it('should have the same functionalities', () => {
    const vector2Keys = Object.keys(Vector2).sort();
    const vector3Keys = Object.keys(Vector3).sort();

    const vector2KeysLength = vector2Keys.length;
    const vector3KeysLength = vector3Keys.length;
    expect(vector2KeysLength).toBe(vector3KeysLength);

    const exclusiveKeys = ['Vector3', 'Vector2'];
    const predicate = (key: string) =>
      !exclusiveKeys.some((i) => key.includes(i));

    expect(vector2Keys.filter(predicate)).toEqual(
      vector3Keys.filter(predicate),
    );
  });

  it('should add vectors', () => {
    expect(Vector2.add({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({ x: 4, y: 6 });
    expect(Vector3.add({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toEqual({
      x: 5,
      y: 7,
      z: 9,
    });
  });

  it('should subtract vectors', () => {
    expect(Vector2.subtract({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({
      x: -2,
      y: -2,
    });
    expect(
      Vector3.subtract({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }),
    ).toEqual({ x: -3, y: -3, z: -3 });
  });

  it('should multiply vectors', () => {
    expect(Vector2.multiply({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({
      x: 3,
      y: 8,
    });
    expect(
      Vector3.multiply({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }),
    ).toEqual({ x: 4, y: 10, z: 18 });
  });

  it('should divide vectors', () => {
    expect(Vector2.divide({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({
      x: 1 / 3,
      y: 2 / 4,
    });
    expect(Vector3.divide({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toEqual({
      x: 1 / 4,
      y: 2 / 5,
      z: 3 / 6,
    });
  });

  it('should round vectors', () => {
    expect(Vector2.round({ x: 1.1, y: 2.2 })).toEqual({ x: 1, y: 2 });
    expect(Vector3.round({ x: 1.1, y: 2.2, z: 3.3 })).toEqual({
      x: 1,
      y: 2,
      z: 3,
    });
  });

  it('should floor vectors', () => {
    expect(Vector2.floor({ x: 1.1, y: 2.2 })).toEqual({ x: 1, y: 2 });
    expect(Vector3.floor({ x: 1.1, y: 2.2, z: 3.3 })).toEqual({
      x: 1,
      y: 2,
      z: 3,
    });
  });

  it('should random vectors', () => {
    expect(Vector2.random({ x: 0, y: 0 }, { x: 1, y: 1 })).toEqual({
      x: expect.any(Number),
      y: expect.any(Number),
    });
    expect(Vector3.random(0, 1)).toEqual({
      x: expect.any(Number),
      y: expect.any(Number),
      z: expect.any(Number),
    });
  });

  it('should calculate the length of vectors', () => {
    expect(Vector2.length({ x: 1, y: 1 })).toBe(Math.sqrt(2));
    expect(Vector3.length({ x: 1, y: 1, z: 1 })).toBe(Math.sqrt(3));
  });

  it('should normalize vectors', () => {
    expect(Vector2.normalize({ x: 1, y: 1 })).toEqual({
      x: 1 / Math.sqrt(2),
      y: 1 / Math.sqrt(2),
    });
    expect(Vector2.normalize({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });

    expect(Vector3.normalize({ x: 1, y: 1, z: 1 })).toEqual({
      x: 1 / Math.sqrt(3),
      y: 1 / Math.sqrt(3),
      z: 1 / Math.sqrt(3),
    });
    expect(Vector3.normalize({ x: 0, y: 0, z: 0 })).toEqual({
      x: 0,
      y: 0,
      z: 0,
    });
  });

  it('should calculate the distance between vectors', () => {
    expect(Vector2.distance({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(0);
    expect(Vector3.distance({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 })).toBe(
      0,
    );
  });

  it('should check if vectors are equal', () => {
    expect(Vector2.equals({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(true);
    expect(Vector3.equals({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 })).toBe(
      true,
    );

    expect(Vector2.equals({ x: 1, y: 1 }, { x: 1, y: 2 })).toBe(false);
    expect(Vector3.equals({ x: 1, y: 1, z: 1 }, { x: 1, y: 2, z: 1 })).toBe(
      false,
    );
  });

  it('should clone vectors', () => {
    const vector2 = { x: 1, y: 1 };
    const vector3 = { x: 1, y: 1, z: 1 };

    expect(Vector2.clone(vector2)).not.toBe(vector2);
    expect(Vector3.clone(vector3)).not.toBe(vector3);
  });

  it('should create vectors from arrays', () => {
    expect(Vector2.fromArray([1, 2])).toEqual({ x: 1, y: 2 });
    expect(Vector3.fromArray([1, 2, 3])).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('should throw and error when creating vectors from arrays with invalid length', () => {
    // @ts-expect-error
    expect(() => Vector2.fromArray([1])).toThrow();
    // @ts-expect-error
    expect(() => Vector3.fromArray([1, 2])).toThrow();
  });

  it('should create arrays from vectors', () => {
    expect(Vector2.toArray({ x: 1, y: 2 })).toEqual([1, 2]);
    expect(Vector3.toArray({ x: 1, y: 2, z: 3 })).toEqual([1, 2, 3]);
  });

  it('should create vectors from string', () => {
    expect(Vector2.fromString('Vector2(1;2)')).toEqual({ x: 1, y: 2 });
    expect(Vector3.fromString('Vector3(1;2;3)')).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('should throw and error when creating vectors from invalid string', () => {
    // @ts-expect-error
    expect(() => Vector2.fromString('Vector2(1)')).toThrow();
    // @ts-expect-error
    expect(() => Vector2.fromString('Vector2(1,a)')).toThrow();
    // @ts-expect-error
    expect(() => Vector3.fromString('Vector3(1,2)')).toThrow();
    // @ts-expect-error
    expect(() => Vector3.fromString('Vector3(1,2,a)')).toThrow();
  });

  it('should create string from vectors', () => {
    expect(Vector2.toString({ x: 1, y: 2 })).toBe('Vector2(1;2)');
    expect(Vector3.toString({ x: 1, y: 2, z: 3 })).toBe('Vector3(1;2;3)');
  });

  it('should convert vectors', () => {
    expect(Vector2.toVector3({ x: 1, y: 2 })).toEqual({ x: 1, y: 2, z: 0 });
    expect(Vector3.toVector2({ x: 1, y: 2, z: 3 })).toEqual({ x: 1, y: 2 });
  });

  it('should validate vectors', () => {
    expect(Vector2.isVector2({ x: 1, y: 2 })).toBe(true);
    expect(Vector3.isVector3({ x: 1, y: 2, z: 3 })).toBe(true);

    expect(Vector2.isVector2({ x: 1, y: 2, z: 3 })).toBe(false);
    expect(Vector3.isVector3({ x: 1, y: 2 })).toBe(false);
  });

  it('should validate vector arrays', () => {
    expect(Vector2.isVector2Array([1, 2])).toBe(true);
    expect(Vector3.isVector3Array([1, 2, 3])).toBe(true);

    expect(Vector2.isVector2Array([1, 2, 3])).toBe(false);
    expect(Vector3.isVector3Array([1, 2])).toBe(false);
  });

  it('should validate vector strings', () => {
    expect(Vector2.isVector2String('Vector2(1;2)')).toBe(true);
    expect(Vector3.isVector3String('Vector3(1;2;3)')).toBe(true);

    expect(Vector2.isVector2String('Vector2(1,2,3)')).toBe(false);
    expect(Vector3.isVector3String('Vector3(1,2)')).toBe(false);
  });
});
