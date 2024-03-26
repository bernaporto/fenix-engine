import type { Unit } from '@fenix-engine/core/Units';
import type { TProductionItem } from '@fenix-engine/utilities/data/Generator';
import type { TLinkableItem } from '@fenix-engine/utilities/data/LinkedTree';
import PRNG from '@fenix-engine/utilities/PRNG';
import type { TTheme } from '../../theme';
import type { TBuildingMetadata, TRoofMetadata } from '../rules';
import { buildAndAppend } from './utils';

export const buildRoof = (
  node: TLinkableItem<TProductionItem>,
  theme: TTheme,
  root: Unit,
  building: TBuildingMetadata
) => {
  const metadata = node.payload.metadata as TRoofMetadata;
  const roofTheme = theme.rule('roof', [metadata.type as string]).get();

  const themeItem = PRNG.choices(roofTheme);
  if (!themeItem) {
    throw new Error(
      `[Builder] Failed to get theme item for roof ${metadata.type}`
    );
  }

  root.append(buildAndAppend(themeItem, building, metadata));
};
