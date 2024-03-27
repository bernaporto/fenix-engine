import type { Unit } from '@fenix-engine/core/Units';
import type { TLinkableItem } from '@fenix-engine/utilities/data/LinkedTree';
import type { TPRNG } from '@fenix-engine/utilities/PRNG';
import type { TProductionItem } from '@fenix-engine/utilities/data/Generator';
import type { TTheme } from '../../theme';
import type { TBuildingMetadata, TRoofMetadata } from '../rules';
import { buildProp } from './utils';

export const buildRoof = (
  node: TLinkableItem<TProductionItem>,
  theme: TTheme,
  root: Unit,
  building: TBuildingMetadata,
  PRNG: TPRNG
) => {
  const metadata = node.payload.metadata as TRoofMetadata;
  const roofTheme = theme
    .rule('roof', [metadata.type, metadata.tileType])
    .get();

  const themeItem = PRNG.choices(roofTheme);
  if (!themeItem) {
    throw new Error(
      `[Builder] Failed to get theme item for roof ${metadata.type}`
    );
  }

  root.append(buildProp(themeItem, building, metadata));
};
