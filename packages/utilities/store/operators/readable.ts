import type { NestedPathOf, NestedValueOf } from '../../@types/helpers';
import type { Readable } from '../../reactivity';
import type { AnyState, BranchStore, Store } from '../types';

export const readable = <T extends AnyState, P extends NestedPathOf<T>>(
  store: BranchStore<T> | Store<T>,
  path: P
): Readable<NestedValueOf<T, P>> => {
  return {
    get: () => store.get(path),
    subscribe: (observer) => store.subscribe(path, observer),
  };
};
