import { type Readable } from '../types';

export const compute = <T, U>(
  input: Readable<T>,
  map: (value: T) => U
): Readable<U> => {
  return {
    get: () => {
      return map(input.get());
    },

    subscribe: (observer) => {
      return input.subscribe((value, prevValue) => {
        if (prevValue === undefined) {
          observer(map(value));
          return;
        }

        observer(map(value), map(prevValue));
      });
    },

    clearObservers: () => {
      input.clearObservers();
    },
  };
};
