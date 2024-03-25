export type TLinkableItem<T> = {
  id: string;
  payload: T;
};

export type TLinkedItem<T> = TLinkableItem<T> & {
  children: TLinkedItem<T>[];
  depth: number;
  parent: TLinkedItem<T> | null;
};

export type TLinkedTree<T> = {
  nodes: TLinkedItem<T>[];
  root: TLinkedItem<T>;
  findNode: (
    predicate: (node: TLinkedItem<T>) => boolean
  ) => TLinkedItem<T> | null;
  getNode: (id: string) => TLinkedItem<T> | null;
};
