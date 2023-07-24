import { deepEqual, traverse } from './object';

describe('traverse', () => {
  it('should navigate through all object nodes.', () => {
    const object = {
      a: { b: { c: 1 } },
      d: { e: 2 },
    };
    traverse(object, (node: unknown) => {
      if (typeof node === 'number') {
        return node + 1;
      }

      return node;
    });
    expect(object).toEqual({
      a: { b: { c: 2 } },
      d: { e: 3 },
    });
  });
});

describe('deepEqual', () => {
  it('should return true if objects are equal.', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
  });

  it('should return false if objects are not equal.', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false);
    expect(deepEqual({ a: 1, b: { c: 2 } }, { b: { d: 2 } })).toBe(false);
  });

  it('should return true if arrays are equal (order matters).', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('should return false if arrays are not equal.', () => {
    expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
    expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    // Order matters
    expect(deepEqual([1, 2, 3], [3, 2, 1])).toBe(false);
  });

  it('should return true if nullables are equal.', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
  });

  it('should return false if nullables are not equal.', () => {
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(undefined, null)).toBe(false);
  });

  it('should return false if types are not equal.', () => {
    expect(deepEqual(null, 1)).toBe(false);
    expect(deepEqual(undefined, 1)).toBe(false);
    expect(deepEqual(1, null)).toBe(false);
    expect(deepEqual(1, undefined)).toBe(false);
    expect(deepEqual(1, '1')).toBe(false);
    expect(deepEqual('1', 1)).toBe(false);
  });
});
