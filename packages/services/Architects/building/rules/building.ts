import type { Vector2 } from '@fenix-engine/core/Math';
import { EBuildingRule, type TBuildingRule } from '../types';
import { random } from '@fenix-engine/utilities/misc';

type TBuildingMetadata = {
  size: Vector2;
};

export const buildingRule: TBuildingRule = {
  type: EBuildingRule.BUILDING,
  apply: ({ building, floors }) => {
    const metadata: TBuildingMetadata = {
      size: building.size,
    };

    const floorCount = floors.max ? random(floors.min, floors.max) : floors.min;
    const floorSymbols = Array.from({ length: floorCount }, (_, i) => ({
      type: EBuildingRule.FLOOR,
      payload: { level: i },
    }));

    return {
      metadata,
      produces: [...floorSymbols, { type: EBuildingRule.ROOF }],
    };
  },
};
