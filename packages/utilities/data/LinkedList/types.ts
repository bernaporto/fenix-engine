export type TLinkedNode<T> = {
  value: Readonly<T>;
  next: () => TLinkedNode<T> | null;
};

export type TLinkedListFactory = {
  build: <T>(root: T, getNext: (node: T) => T | null) => TLinkedNode<T>;
};
