import { describe, expect, it } from 'vitest';
import { curry } from './curry';

describe('curry', () => {
  it('should curry functions', () => {
    const sum = (a: number, b: number) => a + b;
    const curriedSum = curry(sum);

    expect(typeof curriedSum).toBe('function');
    expect(curriedSum(1)).toBeInstanceOf(Function);
    expect(curriedSum(1)(2)).toBe(3);
    expect(curriedSum(1, 2)).toBe(3);
  });

  it('should curry functions (multiple arguments)', () => {
    const sum = (a: number, b: number, c: number) => a + b + c;
    const curriedSum = curry(sum);

    expect(typeof curriedSum).toBe('function');
    expect(curriedSum(1)).toBeInstanceOf(Function);
    expect(curriedSum(1)(2)).toBeInstanceOf(Function);
    expect(curriedSum(1)(2)(3)).toBe(6);
    expect(curriedSum(1, 2, 3)).toBe(6);
  });

  it('should curry functions (multiple arguments, different order)', () => {
    const sum = (a: number, b: number, c: number) => a + b + c;
    const curriedSum = curry(sum);

    expect(typeof curriedSum).toBe('function');
    expect(curriedSum(1)).toBeInstanceOf(Function);
    expect(curriedSum(1)(2)).toBeInstanceOf(Function);
    expect(curriedSum(1)(2)(3)).toBe(6);
    expect(curriedSum(1, 2, 3)).toBe(6);
  });
});
