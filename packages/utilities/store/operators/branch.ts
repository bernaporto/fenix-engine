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

    getReadable: (subPath) =>
      // @ts-ignore
      store.getReadable(getBranchedPath(subPath)),

    getWritable: (subPath) =>
      // @ts-ignore
      store.getWritable(getBranchedPath(subPath)),

    // @ts-ignore
    reset: (subPath, notifyPath) =>
      // @ts-ignore
      store.reset(getBranchedPath(subPath), notifyPath),

    set: (subPath, value, silent) =>
      // @ts-ignore
      store.set(getBranchedPath(subPath), value, silent),

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

    update: (subPath, updater, silent) =>
      // @ts-ignore
      store.update(getBranchedPath(subPath), updater, silent),
  };
};
