import { isNotNullable } from '@fenix-engine/utilities/misc';
import LinkedTree, {
  type TLinkableItem,
} from '@fenix-engine/utilities/data/LinkedTree';
import { Unit } from '@fenix-engine/core/Units';
import type { TProductionItem } from '@fenix-engine/utilities/data/Generator';
import type { TTheme } from '../../theme';
import { EBuildingRule } from '../types';
import type { TBuildingMetadata } from '../rules';
import { buildFloor } from './buildFloor';
import { buildRoof } from './buildRoof';

export const getBuilder =
  (blueprint: TProductionItem) =>
  (theme: TTheme): Unit => {
    const bpTree = LinkedTree.create(toLinkableItem(blueprint), (item) =>
      (item.payload.children ?? []).map((c, index) =>
        toLinkableItem(c, item, index)
      )
    );

    const root = new Unit();
    const building = blueprint.metadata as TBuildingMetadata;

    LinkedTree.traverse(bpTree, (node) => {
      switch (node.payload.type) {
        case EBuildingRule.FLOOR:
          buildFloor(node, theme, root, building);
          break;
        case EBuildingRule.ROOF:
          buildRoof(node, theme, root, building);
          break;
      }
    });

    return root;
  };

const toLinkableItem = (
  item: TProductionItem,
  parent?: TLinkableItem<TProductionItem>,
  index?: number
) => ({
  id: [parent?.id ?? parent?.payload.type, item.type, index]
    .filter(isNotNullable)
    .join('-'),
  payload: item,
});
