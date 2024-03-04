export type LinkableItem<T> = {
  id: string;
  payload: T;
};

export type LinkedItem<T> = LinkableItem<T> & {
  children: LinkedItem<T>[];
  depth: number;
  parent: LinkedItem<T> | null;
};

export type LinkedList<T> = {
  nodes: LinkedItem<T>[];
  root: LinkedItem<T>;
  find: (id: string) => LinkedItem<T> | null;
};

// TODO: improve brunch to avoid recreating the tree
const branch = <T>(node: LinkedItem<T>) =>
  create(node, (el) => (el as LinkedItem<T>).children);

const create = <T>(
  parent: LinkableItem<T>,
  getChildren: (el: LinkableItem<T>) => LinkableItem<T>[]
): LinkedList<T> => {
  const elTree = new Map<string, LinkedItem<T>>();

  const visit =
    (depth: number, parent?: LinkedItem<T>) => (node: LinkableItem<T>) => {
      const childrenElements = getChildren(node);
      const linkedNode: LinkedItem<T> = {
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

  const find = (id: string) => elTree.get(id) ?? null;

  return {
    root,
    find,
    get nodes() {
      return [...elTree.values()];
    },
  };
};

const childless = <T>(node: LinkedItem<T>) => {
  const childless = new Set<LinkedItem<T>>();

  const visit = (node: LinkedItem<T>) => {
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
  tree: LinkedList<T>,
  callback: (node: LinkedItem<T>) => void
) => {
  const visit = (node: LinkedItem<T>) => {
    callback(node);
    node.children.forEach(visit);
  };

  visit(tree.root);
};

const reversedTraverse = <T>(
  tree: LinkedList<T>,
  callback: (node: LinkedItem<T>) => void
) => {
  const nodesByDepth: Record<number, Set<LinkedItem<T>>> = {};
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

export const LinkedList = {
  branch,
  create,
  childless,
  reversedTraverse,
  traverse,
};
