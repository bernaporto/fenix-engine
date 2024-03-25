import { TProductionItem } from '@fenix-engine/utilities/data/Generator';
import LinkedTree from '@fenix-engine/utilities/data/LinkedTree';

export const getBuilder = (blueprint: TProductionItem) => () => {
  const bpTree = LinkedTree.create(toLinkableItem(blueprint), (item) =>
    (item.payload.children ?? []).map((c, index) =>
      toLinkableItem(c, item.payload, index)
    )
  );

  LinkedTree.traverse(bpTree, (node) => {
    console.log('Building node:', node.id, node.payload.type);
  });
};

const toLinkableItem = (
  item: TProductionItem,
  parent?: TProductionItem,
  index?: number
) => ({
  id: [parent?.type, item.type, index].filter(Boolean).join('__'),
  payload: item,
});
