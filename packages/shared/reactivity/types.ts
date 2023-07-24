export type Observer<T> = (value: Readonly<T>) => void;
export type Usubscriber = VoidFunction;

export type Observable<T> = {
  clearObservers: () => void;
  get: () => Readonly<T>;
  set: (value: T) => void;
  subscribe: (observer: Observer<T>) => Usubscriber;
};

export type ReadonlyObservable<T> = Pick<Observable<T>, 'get' | 'subscribe'>;
