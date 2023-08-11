import { makeObservable } from './observable';

describe('Observable', () => {
  it('should be able to subscribe to changes', () => {
    const observable = makeObservable(0);
    const observer = jest.fn();

    observable.subscribe(observer);
    observable.set(1);

    expect(observer).toHaveBeenCalledWith(1);
  });

  it('should be able to unsubscribe from changes', () => {
    const observable = makeObservable(0);
    const observer = jest.fn();

    const unsubscriber = observable.subscribe(observer);
    unsubscriber();
    observable.set(1);

    expect(observer).not.toHaveBeenCalled();
  });

  it('should be able to get the current value', () => {
    const observable = makeObservable(0);

    expect(observable.get()).toBe(0);
  });

  it('should clear all observers with clearObservers.', () => {
    const observable = makeObservable(0);
    const observer = jest.fn();

    observable.subscribe(observer);
    observable.clearObservers();

    observable.set(1);

    expect(observer).not.toHaveBeenCalled();
  });

  describe('(toReadonly)', () => {
    it('should not be able to set the value', () => {
      const observable = makeObservable(0);
      const readonlyObservable = observable.toReadonly();

      expect(readonlyObservable).not.toHaveProperty('set');
    });
  });
});
