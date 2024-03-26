import type { Unit } from '@fenix-engine/core/Units';
import type { TProductionItem } from '@fenix-engine/utilities/data/Generator';
import type { TLinkableItem } from '@fenix-engine/utilities/data/LinkedTree';
import { sampleOne } from '@fenix-engine/utilities/misc';
import type { TTheme } from '../../theme';
import type { TBuildingMetadata, TWallMetadata } from '../rules';
import { buildAndAppend } from './utils';

export const buildFloor = (
  node: TLinkableItem<TProductionItem>,
  theme: TTheme,
  root: Unit,
  building: TBuildingMetadata
) => {
  node.payload.children?.forEach((wall) => {
    const metadata = wall.metadata as TWallMetadata;
    const items = theme.rule('wall', [metadata.type]).get();
    const themeItem = sampleOne(items);

    if (!themeItem) {
      throw new Error(
        `[Builder] Failed to get theme item for wall ${metadata.type}`
      );
    }

    root.append(buildAndAppend(themeItem, building, metadata));
  });
};
