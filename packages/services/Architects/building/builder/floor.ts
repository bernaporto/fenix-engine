import type { Unit } from '@fenix-engine/core/Units';
import type { TLinkableItem } from '@fenix-engine/utilities/data/LinkedTree';
import type { TPRNG } from '@fenix-engine/utilities/PRNG';
import type { TProductionItem } from '@fenix-engine/utilities/data/Generator';
import type { TTheme } from '../../theme';
import type { TBuildingSettings } from '../types';
import type { TWallMetadata } from '../rules';
import { buildProp } from './utils';

export const buildFloor = (
  node: TLinkableItem<TProductionItem>,
  theme: TTheme,
  root: Unit,
  settings: TBuildingSettings,
  PRNG: TPRNG
) => {
  node.payload.children?.forEach((wall) => {
    const metadata = wall.metadata as TWallMetadata;
    const items = theme.rule('wall', [metadata.type]).get();
    const themeItem = PRNG.choices(items);

    if (!themeItem) {
      throw new Error(
        `[Builder] Failed to get theme item for wall ${metadata.type}`
      );
    }

    root.append(buildProp(themeItem, settings, metadata));
  });
};
