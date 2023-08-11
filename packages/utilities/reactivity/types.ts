export type Observer<T> = (value: Readonly<T>) => void;
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
export type Operator = (value: any) => unknown;
export type LastFnReturnType<Fns extends Operator[]> = Fns extends [
  ...infer _,
  infer L
]
  ? L extends (...args: any) => infer R
    ? R
    : never
  : never;

export type GetObservableValues<T extends any[]> = T extends [
  ...infer Rest,
  infer L
]
  ? L extends ReadonlyObservable<infer V>
    ? [V, ...GetObservableValues<Rest>]
    : never
  : [];
