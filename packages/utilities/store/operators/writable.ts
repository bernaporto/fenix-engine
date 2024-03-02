import type { NestedPathOf, NestedValueOf } from '../../@types/helpers';
import type { Observable } from '../../reactivity';
import type { AnyState, BranchStore, Store } from '../types';

export const writable = <T extends AnyState, P extends NestedPathOf<T>>(
  store: BranchStore<T> | Store<T>,
  path: P
): Observable<NestedValueOf<T, P>> => {
  const subscriptions = new Set<VoidFunction>();

  return {
    get: () => store.get(path),
    set: (newValue) => store.set(path, newValue),
    subscribe: (observer) => {
      const unsubscribe = store.subscribe(path, observer);
      subscriptions.add(unsubscribe);

      return () => {
        unsubscribe();
        subscriptions.delete(unsubscribe);
      };
    },
    clearObservers: () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      subscriptions.clear();
    },
  };
};
