import PRNG from '@fenix-engine/utilities/PRNG';
import { EBuildingRule, EFaceDirection, type TBuildingRule } from '../types';

export type TFloorMetadata = {
  floor: number;
};

type TFloorPayload = {
  floor: number;
};

export const floorRule: TBuildingRule<TFloorPayload> = {
  type: EBuildingRule.FLOOR,
  apply: (settings, { floor }) => {
    const { floors, seed } = settings;
    const floorStrategy = floors.strategy ?? 'default';
    const floorSeed = floorStrategy === 'default' ? seed : undefined;
    const prng = floorSeed ? PRNG.create(floorSeed) : settings.defaultPRNG;

    const getWallSymbol = (
      x: number,
      y: number,
      direction: EFaceDirection,
    ) => ({
      type: EBuildingRule.WALL,
      payload: {
        floor,
        direction,
        prng,
        position: { x, y },
      },
    });

    const { building } = settings;

    const eastWalls = Array.from({ length: building.size.y }, (_, i) =>
      getWallSymbol(building.size.x, i, EFaceDirection.EAST),
    );
    const northWalls = Array.from({ length: building.size.x }, (_, i) =>
      getWallSymbol(i, 0, EFaceDirection.NORTH),
    );
    const westWalls = Array.from({ length: building.size.y }, (_, i) =>
      getWallSymbol(0, i, EFaceDirection.WEST),
    );
    const southWalls = Array.from({ length: building.size.x }, (_, i) =>
      getWallSymbol(i, building.size.y, EFaceDirection.SOUTH),
    );

    const metadata: TFloorMetadata = { floor };

    return {
      metadata,
      produces: [...northWalls, ...eastWalls, ...southWalls, ...westWalls],
    };
  },
};
