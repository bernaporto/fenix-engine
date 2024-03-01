import type { NestedPathOf, NestedValueOf } from '../../@types/helpers';
import type { Observable } from '../../reactivity';
import type { AnyState, BranchStore, Store } from '../types';

export const writable = <T extends AnyState, P extends NestedPathOf<T>>(
  store: BranchStore<T> | Store<T>,
  path: P
): Observable<NestedValueOf<T, P>> => {
  return {
    get: () => store.get(path),
    set: (newValue) => store.set(path, newValue),
    subscribe: (observer) => store.subscribe(path, observer),
    clearObservers: () => store.clearAllListeners(),
  };
};
