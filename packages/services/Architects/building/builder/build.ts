import { isNotNullable } from '@fenix-engine/utilities/misc';
import LinkedTree, {
  type TLinkableItem,
} from '@fenix-engine/utilities/data/LinkedTree';
import { TPRNG } from '@fenix-engine/utilities/PRNG/PRNG';
import type { TProductionItem } from '@fenix-engine/utilities/data/Generator';
import { Unit } from '@fenix-engine/core/Units';
import type { TTheme } from '../../theme';
import { applyStrategies } from '../strategies';
import { EBuildingRule, type TBuildingSettings } from '../types';
import { buildFloor } from './floor';
import { buildRoof } from './roof';

export const build = (
  settings: TBuildingSettings,
  blueprint: TProductionItem,
  theme: TTheme,
  PRNG: TPRNG
): Unit => {
  const bpTree = LinkedTree.create(toLinkableItem(blueprint), (item) =>
    (item.payload.children ?? []).map((c, index) =>
      toLinkableItem(c, item, index)
    )
  );
  applyStrategies(settings, bpTree);

  const root = new Unit();

  LinkedTree.traverse(bpTree, (node) => {
    switch (node.payload.type) {
      case EBuildingRule.FLOOR:
        buildFloor(node, theme, root, settings, PRNG);
        break;
      case EBuildingRule.ROOF:
        buildRoof(node, theme, root, settings, PRNG);
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
