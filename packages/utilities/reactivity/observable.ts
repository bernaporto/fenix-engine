import { clone } from '../misc/clone';
import type { Observable, Observer } from './types';

export const observable = <T>(initialValue: T): Observable<T> => {
  let value: Readonly<T> = clone(initialValue);
  const observers = new Map<symbol, Observer<T>>();

  const observable: Observable<T> = {
    clearObservers: () => {
      observers.clear();
    },

    get: () => clone(value),

    set: (newValue) => {
      const prevValue = clone(value);
      value = clone(newValue);

      // don't notify observers if the value hasn't changed
      if (prevValue === value) return;

      observers.forEach((observer) => observer(clone(value), prevValue));
    },

    subscribe: (observer, notifyImmediately = true) => {
      const id = Symbol();
      observers.set(id, observer);

      if (notifyImmediately) {
        observer(clone(value));
      }

      return () => {
        observers.delete(id);
      };
    },

    update: (updater) => {
      observable.set(updater(clone(value)));
    },
  };

  return observable;
};
