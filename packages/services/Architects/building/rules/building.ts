import { Vector2 } from '@fenix-engine/core/Math';
import { EBuildingRule, type TBuildingRule } from '../types';

export type TBuildingMetadata = {
  size: Vector2;
};

export const buildingRule: TBuildingRule = {
  type: EBuildingRule.BUILDING,
  apply: ({ building, defaultPRNG, floors, seed }) => {
    const floorStrategy = floors.strategy ?? 'copy';
    const floorSeed =
      floorStrategy === 'copy' ? seed ?? Date.now() * Math.random() : undefined;

    const totalFloors = floors.max
      ? defaultPRNG.rangeInt(floors.min, floors.max)
      : floors.min;

    const floorSymbols = Array.from({ length: totalFloors }, (_, floor) => ({
      type: EBuildingRule.FLOOR,
      payload: { floor, seed: floorSeed },
    }));

    const roofPartsCount = building.size.x * building.size.y;
    const roofSymbols = Array.from({ length: roofPartsCount }, (_, i) => ({
      type: EBuildingRule.ROOF,
      payload: {
        roofLevel: totalFloors,
        position: {
          x: i % building.size.x,
          y: Math.floor(i / building.size.x),
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
