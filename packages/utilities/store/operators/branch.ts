import type { NestedPathOf, NestedValueOf } from '../../@types/helpers';
import type { AnyState, BranchStore, Store } from '../types';

export const branch = <
  T extends AnyState,
  P extends NestedPathOf<T>,
  U extends NestedValueOf<T, P>
>(
  store: Store<T> | BranchStore<T>,
  path: P
  // @ts-ignore
): BranchStore<U> => {
  const subscriptions = new Set<VoidFunction>();
  const getBranchedPath = (subPath?: string) =>
    [path, subPath].filter(Boolean).join('.');

  return {
    clearAllListeners: () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      subscriptions.clear();
    },

    // @ts-ignore
    get: (subPath) => store.get(getBranchedPath(subPath)),

    // @ts-ignore
    getState: () => store.get(path),

    // @ts-ignore
    reset: (subPath) => store.reset(getBranchedPath(subPath)),

    // @ts-ignore
    set: (subPath, value) => store.set(getBranchedPath(subPath), value),

    subscribe: (subPath, listener, notifyImmediately) => {
      const subscription = store.subscribe(
        // @ts-ignore
        getBranchedPath(subPath),
        listener,
        notifyImmediately
      );
      subscriptions.add(subscription);

      return subscription;
    },

    update: (subPath, updater) =>
      // @ts-ignore
      store.update(getBranchedPath(subPath), updater),
  };
};
