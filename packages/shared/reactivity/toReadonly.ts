import type { Observable, ReadonlyObservable } from './types';

export const toReadonly = <T>(
  observable: Observable<T>,
): ReadonlyObservable<T> => {
  const { get, subscribe } = observable;

  return {
    get,
    subscribe,
  };
};
