import type { NestedPathOf, NestedValueOf } from '../../@types/helpers';
import type { Observable } from '../../reactivity';
import type { AnyState, BranchStore, Store } from '../types';

export const writable = <T extends AnyState, P extends NestedPathOf<T>>(
  store: BranchStore<T> | Store<T>,
  path: P,
  silent = false,
): Observable<NestedValueOf<T, P>> => {
  const subscriptions = new Set<VoidFunction>();

  return {
    clearObservers: () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      subscriptions.clear();
    },
    get: () => store.get(path),
    set: (newValue) => {
      store.set(path, newValue, silent);
    },
    subscribe: (observer) => {
      const unsubscribe = store.subscribe(path, observer);
      subscriptions.add(unsubscribe);

      return () => {
        unsubscribe();
        subscriptions.delete(unsubscribe);
      };
    },
    update: (updater) => {
      store.update(path, updater, silent);
    },
  };
};
