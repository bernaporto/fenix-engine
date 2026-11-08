import { describe, expect, it, vi } from 'vitest';
import { readable } from './readable';
import { observable } from './observable';

describe('Observable', () => {
  it('should be able to subscribe to changes', () => {
    const value = observable(0);
    const observer = vi.fn();

    value.subscribe(observer);
    value.set(1);

    expect(observer).toHaveBeenCalledWith(1, 0);
  });

  it('should be able to unsubscribe from changes', () => {
    const value = observable(0);
    const observer = vi.fn();

    const unsubscriber = value.subscribe(observer);
    unsubscriber();
    value.set(1);

    expect(observer).not.toHaveBeenCalled();
  });

  it('should be able to get the current value', () => {
    const value = observable(0);

    expect(value.get()).toBe(0);
  });

  it('should clear all observers with clearObservers.', () => {
    const value = observable(0);
    const observer = vi.fn();

    value.subscribe(observer);
    value.clearObservers();

    value.set(1);

    expect(observer).not.toHaveBeenCalled();
  });

  describe('(readable)', () => {
    it('should not be able to set the value', () => {
      const value = observable(0);
      const reaonlyValue = readable(value);

      expect(reaonlyValue).not.toHaveProperty('set');
    });
  });
});
