import type { Observable, Readable } from './types';

export const readable = <T>(target: Observable<T>): Readable<T> => {
  return {
    get: target.get,
    subscribe: target.subscribe,
  };
};
