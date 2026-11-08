import type { TLinkableItem } from './types';
import { LinkedTree } from './LinkedTree';

type LinkableTestItem = TLinkableItem<{ input?: string[]; output?: string }>;
const linkA = 'link-a';
const linkB = 'link-b';
const linkC = 'link-c';

const testItems: LinkableTestItem[] = [
  {
    id: '0',
    payload: { input: [linkA, linkB] },
  },
  {
    id: '1',
    payload: { input: [linkC], output: linkA },
  },
  {
    id: '2',
    payload: { output: linkC },
  },
  {
    id: '3',
    payload: { output: linkB },
  },
];

const findChildren = (item: LinkableTestItem) => {
  return testItems.filter((el) =>
    el.payload.output ? item.payload.input?.includes(el.payload.output) : false,
  );
};

describe('LinkedTree', () => {
  it('should create a linked list', () => {
    const tree = LinkedTree.create(testItems[0], findChildren);

    expect(tree).toBeDefined();
    expect(tree.root).toBeDefined();
    expect(tree.nodes).toHaveLength(4);
  });

  it('should create a branch', () => {
    const tree = LinkedTree.create(testItems[0], findChildren);
    const branch = LinkedTree.branch(tree.nodes[1]);

    expect(branch).toBeDefined();
    expect(branch.root).toBeDefined();
    expect(branch.nodes).toHaveLength(2);
  });

  it('should find all childless nodes', () => {
    const tree = LinkedTree.create(testItems[0], findChildren);
    const childlessNodes = LinkedTree.childless(tree.root);

    expect(childlessNodes[0]?.id).toEqual('2');
  });

  it('should traverse the tree', () => {
    const tree = LinkedTree.create(testItems[0], findChildren);
    const nodes = new Set<LinkableTestItem>();

    LinkedTree.traverse(tree, (node) => {
      console.log('node', node);
      nodes.add(node);
    });

    expect([...nodes]).toHaveLength(4);
    expect([...nodes].at(0)).toEqual(tree.root);
  });

  it('should traverse the tree in reverse', () => {
    const tree = LinkedTree.create(testItems[0], findChildren);
    const nodes = new Set<LinkableTestItem>();

    LinkedTree.reversedTraverse(tree, (node) => nodes.add(node));

    expect([...nodes]).toHaveLength(4);
    expect([...nodes].at(-1)).toEqual(tree.root);
  });

  it('should find a node by id or return null otherwise', () => {
    const tree = LinkedTree.create(testItems[0], findChildren);
    const nodeA = tree.findNode((node) => node.id === '1');
    const nodeB = tree.findNode((node) => node.id === '4');

    expect(nodeA).toBeDefined();
    expect(nodeA?.id).toEqual('1');
    expect(nodeB).toBeNull();
  });
});
