import { getFromPath, setOnPath, clone } from '../misc';
import { compute } from '../reactivity/operators';
import { createStore } from './createStore';
import { readable } from './operators/readable';
import { log } from './utils';

describe('Store', () => {
  // SUBSCRIBE
  describe('subscribe', () => {
    it('should report updates to subscribers.', () => {
      const store = createStore({ foo: 'bar' });
      const subscriber = jest.fn();

      store.subscribe('foo', subscriber);
      store.set('foo', 'baz');

      expect(subscriber).toHaveBeenLastCalledWith('baz', 'bar');
    });

    it('should not report updates to subscribers if value do not change.', () => {
      const store = createStore({ foo: 'bar' });
      const subscriber = jest.fn();

      store.subscribe('foo', subscriber, false);
      store.set('foo', 'bar');

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should not report updates to unsubscribed subscribers.', () => {
      const store = createStore({ foo: 'bar' });
      const subscriber = jest.fn();

      const unsubscribe = store.subscribe('foo', subscriber, false);
      unsubscribe();

      store.set('foo', 'baz');

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should not report updates to subscribers of other keys.', () => {
      const store = createStore({ foo: 'bar', baz: 'qux' });
      const subscriber = jest.fn();

      store.subscribe('foo', subscriber, false);
      store.set('baz', 'baz');

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should report updates to all subscribers in parent keys for nested keys.', () => {
      const store = createStore({ foo: { bar: 'baz' } });
      const subscriberA = jest.fn();
      const subscriberB = jest.fn();

      store.subscribe('foo.bar', subscriberA);
      store.subscribe('foo', subscriberB);

      store.set('foo.bar', 'qux');

      expect(subscriberA).toHaveBeenLastCalledWith('qux', 'baz');
      expect(subscriberB).toHaveBeenLastCalledWith(
        { bar: 'qux' },
        { bar: 'baz' }
      );
    });

    it('should report updates to subscribers in child keys for nested keys if value changes.', () => {
      const store = createStore({ foo: { bar: 'baz' } });
      const subscriber = jest.fn();

      store.subscribe('foo.bar', subscriber);

      store.set('foo', {
        bar: 'qux',
      });

      expect(subscriber).toHaveBeenLastCalledWith('qux', 'baz');
    });

    it('should not report updates to subscribers in child keys, for nested keys, if value do not change.', () => {
      const store = createStore({ foo: { bar: 'baz', baz: 'qux' } });
      const subscriber = jest.fn();

      store.subscribe('foo.bar', subscriber, false);

      store.set('foo', {
        bar: 'baz',
        baz: 'null',
      });

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should not report updates to other subscribers for sibling keys.', () => {
      const store = createStore({ foo: { bar: 'baz', baz: 'qux' } });
      const subscriberA = jest.fn();
      const subscriberB = jest.fn();

      store.subscribe('foo.bar', subscriberA, false);
      store.subscribe('foo.baz', subscriberB, false);

      store.set('foo', {
        bar: 'qux',
        baz: 'qux',
      });

      expect(subscriberA).toHaveBeenLastCalledWith('qux', 'baz');
      expect(subscriberB).not.toHaveBeenCalled();
    });
  });

  // GET
  describe('get', () => {
    it('should return the current value of a key.', () => {
      const store = createStore({ foo: 'bar' });

      expect(store.get('foo')).toBe('bar');
    });

    it('should return the current value of a nested key.', () => {
      const store = createStore({ foo: { bar: 'baz' } });

      expect(store.get('foo.bar')).toBe('baz');
    });

    it('should return the current value of a nested key after an update.', () => {
      const store = createStore({ foo: { bar: 'baz' } });

      store.set('foo.bar', 'qux');

      expect(store.get('foo.bar')).toBe('qux');
    });
  });

  describe('getState', () => {
    it('should return the current state.', () => {
      const store = createStore({ foo: 'bar' });

      expect(store.getState()).toEqual({ foo: 'bar' });
    });
  });

  // SET
  describe('set', () => {
    it('should update a key.', () => {
      const store = createStore({ foo: 'bar' });

      store.set('foo', 'baz');

      expect(store.get('foo')).toBe('baz');
    });

    it('should update a nested key.', () => {
      const store = createStore({ foo: { bar: 'baz' } });

      store.set('foo.bar', 'qux');

      expect(store.get('foo.bar')).toBe('qux');
    });

    it('should notify subscribers of a key.', () => {
      const store = createStore({ foo: 'bar' });
      const subscriber = jest.fn();

      store.subscribe('foo', subscriber);

      store.set('foo', 'baz');

      expect(subscriber).toHaveBeenLastCalledWith('baz', 'bar');
    });
  });

  // CLEAR
  describe('clear', () => {
    it('should clear all listeners.', () => {
      const store = createStore({ foo: 'bar' });
      const subscriber = jest.fn();

      store.subscribe('foo', subscriber, false);
      store.clearAllListeners();
      store.set('foo', 'baz');

      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  // RESET
  describe('reset', () => {
    it('should reset a nested key to its initial value.', () => {
      const store = createStore({ foo: 'bar' });

      store.set('foo', 'baz');
      store.reset('foo');

      expect(store.get('foo')).toBe('bar');
    });

    it('should gracefully try to reset value even if key does not exist in initial state.', () => {
      const store = createStore<Record<string, any>>({ foo: { bar: 'baz' } });

      store.set('foo.bar', 'qux');
      store.set('foo.qux', 'baz');
      store.reset('foo.qux.0');
      store.reset('foo.qux');
      store.reset('bar');

      expect(store.get('foo')).toEqual({ bar: 'qux' });
    });
  });

  // DEBUG
  describe('_setDebugMode', () => {
    it('should enable logs when setting values.', () => {
      const store = createStore({ foo: { bar: 'baz', qux: 'quz' } });
      store.subscribe('foo.bar', () => {});
      store.subscribe('foo', () => {});
      store._setDebugMode(true);

      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

      store.set('foo.bar', 'qux');

      expect(spy).toHaveBeenCalled();
    });

    it('should enable logs when trying to reset undefined values.', () => {
      const store = createStore({ foo: { bar: 'baz', qux: 'quz' } });
      store.subscribe('foo.bar', () => {});
      store.subscribe('foo', () => {});
      store._setDebugMode(true);

      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // @ts-ignore
      store.reset('foo.baz');

      expect(spy).toHaveBeenCalled();
    });
  });
});

// GET VALUE FROM PATH
describe('getFromPath', () => {
  it('should return the current value of a key.', () => {
    const object = { foo: 'bar' };

    expect(getFromPath(object, 'foo')).toBe('bar');
  });

  it('should return the current value of a nested key.', () => {
    const object = { foo: { bar: 'baz' } };

    expect(getFromPath(object, 'foo.bar')).toBe('baz');
  });

  it('should return undefined if the path does not exist.', () => {
    const object: Record<any, any> = { foo: 'bar' };

    expect(getFromPath(object, 'baz')).toBe(undefined);
  });

  it('should return undefined if the nested path does not exist.', () => {
    const object: Record<any, any> = {};

    expect(getFromPath(object, 'foo.baz')).toBe(undefined);
    expect(getFromPath(object, 'foo.baz.bar')).toBe(undefined);
    expect(getFromPath(object, 'foo.baz.bar.0.qux')).toBe(undefined);
  });
});

// SET VALUE ON PATH
describe('setOnPath', () => {
  it('should set a value on a path.', () => {
    const object = { foo: 'bar' };

    setOnPath(object, 'foo', 'baz');

    expect(object).toEqual({ foo: 'baz' });
  });

  it('should set a value on a nested path.', () => {
    const object = { foo: { bar: 'baz' } };

    setOnPath(object, 'foo.bar', 'qux');

    expect(object).toEqual({ foo: { bar: 'qux' } });
  });

  it('should set a value on a nested path with an array.', () => {
    const object = { foo: { bar: ['baz'] } };

    // @ts-ignore - TODO: this is a valid use case. Fix types.
    setOnPath(object, 'foo.bar.0', 'qux');

    expect(object).toEqual({ foo: { bar: ['qux'] } });
  });

  it('should set a value on a nested path even when parents are not defined yet.', () => {
    const object: Record<any, any> = {};

    setOnPath(object, 'foo.bar', 'baz');

    expect(object).toEqual({ foo: { bar: 'baz' } });
  });
});

// CLONE
describe('clone', () => {
  it('should throw an error if structuredClone fails or is undefined.', () => {
    (global as any).structuredClone = undefined;
    const object = { foo: 'bar' };

    expect(() => clone(object)).toThrowError(
      'Could not clone state. Make sure all values are serializable.'
    );
  });
});

// LOG
describe('log', () => {
  it('should log a message.', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    log({
      baseMsg: 'foo',
      path: 'bar',
      newValue: 'baz',
      oldValue: 'qux',
      listeners: 1,
    });

    expect(spy).toHaveBeenCalled();
  });
});

// OBSERVABLE OPERATORS

describe('compute + store', () => {
  const originalStructuredClone = (global as any).structuredClone;

  beforeAll(() => {
    (global as any).structuredClone = (value: any) => value;
  });

  afterAll(() => {
    (global as any).structuredClone = originalStructuredClone;
  });

  it('should compute functions', () => {
    const store = createStore({
      value: 0,
    });
    const computedValue = compute(
      readable(store, 'value'),
      (value: number) => `value: ${value}`
    );
    const observer = jest.fn();
    computedValue.subscribe(observer);

    expect(computedValue.get()).toBe('value: 0');
    expect(observer).toHaveBeenCalledTimes(0);

    store.set('value', 10);
    expect(computedValue.get()).toBe('value: 10');
    expect(observer).toHaveBeenCalledTimes(1);
    expect(observer).toHaveBeenLastCalledWith('value: 10', 'value: 0');
  });
});
