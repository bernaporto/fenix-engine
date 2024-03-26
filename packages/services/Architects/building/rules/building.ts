import { Vector2 } from '@fenix-engine/core/Math';
import { EBuildingRule, type TBuildingRule } from '../types';
import { randomInt } from '@fenix-engine/utilities/misc';

export type TBuildingMetadata = {
  size: Vector2;
};

export const buildingRule: TBuildingRule = {
  type: EBuildingRule.BUILDING,
  apply: ({ building, floors }) => {
    const totalFloors = floors.max
      ? randomInt(floors.min, floors.max)
      : floors.min;
    const floorSymbols = Array.from({ length: totalFloors }, (_, floor) => ({
      type: EBuildingRule.FLOOR,
      payload: { floor, totalFloors },
    }));

    const roofPartsCount = building.size.x * building.size.y;
    const roofSymbols = Array.from({ length: roofPartsCount }, (_, i) => ({
      type: EBuildingRule.ROOF,
      payload: {
        position: {
          x: (i % building.size.x) + 0.5,
          y: totalFloors,
          z: Math.floor(i / building.size.x) + 0.5,
        },
      },
    }));

    const metadata: TBuildingMetadata = {
      size: building.size,
    };

    return {
      metadata,
      produces: [...floorSymbols, ...roofSymbols],
    };
  },
};
