import type { TLinkableItem, TLinkedItem, TLinkedTree } from './types';

// TODO: improve brunch to avoid recreating the tree
const branch = <T>(node: TLinkedItem<T>) =>
  create(node, (el) => (el as TLinkedItem<T>).children);

const create = <T>(
  parent: TLinkableItem<T>,
  getChildren: (el: TLinkableItem<T>) => TLinkableItem<T>[]
): TLinkedTree<T> => {
  const elTree = new Map<string, TLinkedItem<T>>();

  const visit =
    (depth: number, parent?: TLinkedItem<T>) => (node: TLinkableItem<T>) => {
      const childrenElements = getChildren(node);
      const linkedNode: TLinkedItem<T> = {
        depth,
        parent: parent ?? null,
        children: [],
        ...node,
      };

      linkedNode.children = childrenElements.map(visit(depth + 1, linkedNode));
      elTree.set(node.id, linkedNode);

      return linkedNode;
    };
  const root = visit(0)(parent);

  const getNode = (id: string) => elTree.get(id) ?? null;

  const findNode = (predicate: (node: TLinkedItem<T>) => boolean) =>
    [...elTree.values()].find(predicate) ?? null;

  return {
    findNode,
    getNode,
    root,
    get nodes() {
      return [...elTree.values()];
    },
  };
};

const childless = <T>(node: TLinkedItem<T>) => {
  const childless = new Set<TLinkedItem<T>>();

  const visit = (node: TLinkedItem<T>) => {
    if (node.children.length === 0) {
      childless.add(node);
    } else {
      node.children.forEach(visit);
    }
  };

  visit(node);

  return [...childless];
};

const traverse = <T>(
  tree: TLinkedTree<T>,
  callback: (node: TLinkedItem<T>) => void
) => {
  const visit = (node: TLinkedItem<T>) => {
    callback(node);
    node.children.forEach(visit);
  };

  visit(tree.root);
};

const reversedTraverse = <T>(
  tree: TLinkedTree<T>,
  callback: (node: TLinkedItem<T>) => void
) => {
  const nodesByDepth: Record<number, Set<TLinkedItem<T>>> = {};
  tree.nodes.forEach((node) => {
    const list = nodesByDepth[node.depth] ?? new Set();
    list.add(node);

    nodesByDepth[node.depth] = list;
  });

  Object.values(nodesByDepth)
    .reverse()
    .forEach((nodes) => {
      nodes.forEach((node) => callback(node));
    });
};

export const LinkedTree = {
  branch,
  create,
  childless,
  reversedTraverse,
  traverse,
};
