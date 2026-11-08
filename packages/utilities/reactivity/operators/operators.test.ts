import { describe, expect, it, vi } from 'vitest';
import { compute } from './compute';
import { observable } from '../observable';

describe('compute', () => {
  it('should return a observable that outputs a new value', () => {
    const value = observable(0);
    const readable = compute(value, (value: number) => `value: ${value}`);
    const observer = vi.fn();
    readable.subscribe(observer);

    expect(readable.get()).toBe('value: 0');
    expect(observer).toHaveBeenCalledTimes(0);

    value.set(10);
    expect(readable.get()).toBe('value: 10');
    expect(observer).toHaveBeenCalledTimes(1);
    expect(observer).toHaveBeenLastCalledWith('value: 10', 'value: 0');
  });
});
