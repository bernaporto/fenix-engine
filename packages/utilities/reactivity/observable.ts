import type { Observable, Observer } from './types';

export const makeObservable = <T>(initialValue: T): Observable<T> => {
  let value: Readonly<T> = structuredClone(initialValue);
  const observers = new Map<Symbol, Observer<T>>();

  return {
    get: () => structuredClone(value),
    set: (newValue) => {
      value = structuredClone(newValue);
      observers.forEach((observer) => observer(structuredClone(value)));
    },
    subscribe: (observer) => {
      const id = Symbol();
      observers.set(id, observer);

      return () => {
        observers.delete(id);
      };
    },
    clearObservers: () => {
      observers.clear();
    },
  };
};
