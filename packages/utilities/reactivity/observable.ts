import type { Observable, Observer } from './types';

export const makeObservable = <T>(initialValue: T): Observable<T> => {
  let value: Readonly<T> = structuredClone(initialValue);
  const observers = new Map<Symbol, Observer<T>>();

  const observable: Observable<T> = {
    clearObservers: () => {
      observers.clear();
    },

    get: () => structuredClone(value),

    set: (newValue) => {
      const prevValue = structuredClone(value);
      value = structuredClone(newValue);

      observers.forEach((observer) =>
        observer(structuredClone(value), prevValue)
      );
    },

    subscribe: (observer) => {
      const id = Symbol();
      observers.set(id, observer);

      return () => {
        observers.delete(id);
      };
    },

    toReadable: () => ({
      get: observable.get,
      subscribe: observable.subscribe,
    }),
  };

  return observable;
};
