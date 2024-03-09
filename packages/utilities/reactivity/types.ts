import type { VoidFunction } from '../@types';

export type Observer<T> = (value: Readonly<T>, prevValue?: Readonly<T>) => void;
export type Usubscriber = VoidFunction;

export type Observable<T> = {
  clearObservers: () => void;
  get: () => Readonly<T>;
  set: (value: T) => void;
  subscribe: (observer: Observer<T>) => Usubscriber;
  update: (updater: (value: T) => T) => void;
};

export type Readable<T> = Pick<
  Observable<T>,
  'clearObservers' | 'get' | 'subscribe'
>;
