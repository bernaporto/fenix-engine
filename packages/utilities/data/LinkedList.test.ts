import { type LinkableItem, LinkedList } from './LinkedList';

type LinkableTestItem = LinkableItem<{ input?: string[]; output?: string }>;
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
    el.payload.output ? item.payload.input?.includes(el.payload.output) : false
  );
};

describe('LinkedList', () => {
  it('should create a linked list', () => {
    const tree = LinkedList.create(testItems[0], findChildren);

    expect(tree).toBeDefined();
    expect(tree.root).toBeDefined();
    expect(tree.nodes).toHaveLength(4);
  });

  it('should create a branch', () => {
    const tree = LinkedList.create(testItems[0], findChildren);
    const branch = LinkedList.branch(tree.nodes[1]);

    expect(branch).toBeDefined();
    expect(branch.root).toBeDefined();
    expect(branch.nodes).toHaveLength(2);
  });

  it('should find all childless nodes', () => {
    const tree = LinkedList.create(testItems[0], findChildren);
    const childlessNodes = LinkedList.childless(tree.root);

    expect(childlessNodes[0]?.id).toEqual('2');
  });

  it('should traverse the tree', () => {
    const tree = LinkedList.create(testItems[0], findChildren);
    const nodes = new Set<LinkableTestItem>();

    LinkedList.traverse(tree, (node) => {
      console.log('node', node);
      nodes.add(node);
    });

    expect([...nodes]).toHaveLength(4);
    expect([...nodes].at(0)).toEqual(tree.root);
  });

  it('should traverse the tree in reverse', () => {
    const tree = LinkedList.create(testItems[0], findChildren);
    const nodes = new Set<LinkableTestItem>();

    LinkedList.reversedTraverse(tree, (node) => nodes.add(node));

    expect([...nodes]).toHaveLength(4);
    expect([...nodes].at(-1)).toEqual(tree.root);
  });

  it('should find a node by id or return null otherwise', () => {
    const tree = LinkedList.create(testItems[0], findChildren);
    const nodeA = tree.find('1');
    const nodeB = tree.find('5');

    expect(nodeA).toBeDefined();
    expect(nodeA?.id).toEqual('1');
    expect(nodeB).toBeNull();
  });
});
