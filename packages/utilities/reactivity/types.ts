import type { VoidFunction } from '../@types';
import type { AnyFunction } from '../functional/types';

export type Observer<T> = (value: Readonly<T>, prevValue?: Readonly<T>) => void;
export type Usubscriber = VoidFunction;

export type Observable<T> = {
  clearObservers: () => void;
  get: () => Readonly<T>;
  set: (value: T) => void;
  subscribe: (observer: Observer<T>) => Usubscriber;
  toReadable: () => ReadonlyObservable<T>;
};

export type ReadonlyObservable<T> = Pick<Observable<T>, 'get' | 'subscribe'>;

/* OPERATORS */
export type GetObservableValues<T extends any[]> = T extends [
  ...infer Rest,
  infer L
]
  ? L extends ReadonlyObservable<infer V>
    ? [V, ...GetObservableValues<Rest>]
    : never
  : [];

// Collection
export type Collection<T> = {
  pop: () => T | undefined;
  shift: () => T | undefined;
  push: (...values: T[]) => void;
  unshift: (value: T) => void;
  get: () => T[];
  getOne: (index: number) => T | undefined;
  set: (index: number, value: T) => void;
  delete: (index: number) => void;
  clear: () => void;
} & {
  map: <R>(predicate: (value: T, index: number) => R) => R[];
  filter: (predicate: (value: T, index: number) => boolean) => T[];
  reduce: <R>(
    predicate: (accumulator: R, value: T, index: number) => R,
    initialValue: R
  ) => R;
  some: (predicate: (value: T, index: number) => boolean) => boolean;
  every: (predicate: (value: T, index: number) => boolean) => boolean;
  find: (predicate: (value: T, index: number) => boolean) => T | undefined;
  findIndex: (predicate: (value: T, index: number) => boolean) => number;
  includes: (value: T) => boolean;
  indexOf: (value: T) => number;
  lastIndexOf: (value: T) => number;
} & {
  subscribe: (observer: Observer<T[]>) => Usubscriber;
  subscribeTo: (index: number, listener: Observer<T>) => Usubscriber;
};
