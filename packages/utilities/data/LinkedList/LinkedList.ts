import type { TLinkedListFactory } from './types';

export const LinkedList: TLinkedListFactory = {
  build: (root, getNext) => {
    const next = getNext(root);

    return {
      value: root,
      next: () => {
        if (next === null) {
          return null;
        }

        return LinkedList.build(next, getNext);
      },
    };
  },
};
