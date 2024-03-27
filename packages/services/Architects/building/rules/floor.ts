import { Vector2 } from '@fenix-engine/core/Math';
import {
  EBuildingRule,
  EFaceDirection,
  EWallType,
  type TBuildingSettings,
  type TBuildingRule,
} from '../types';

type TFloorPayload = {
  floor: number;
  totalFloors: number;
};

export const floorRule: TBuildingRule<TFloorPayload> = {
  type: EBuildingRule.FLOOR,
  apply: (settings, { floor }) => {
    const getWallSymbol = (
      x: number,
      z: number,
      direction: EFaceDirection
    ) => ({
      type: EBuildingRule.WALL,
      payload: {
        direction,
        position: { x, y: floor, z },
        types: getAllowedWalls(settings, floor, direction, { x, y: z }),
      },
    });

    const { building } = settings;

    const eastWalls = Array.from({ length: building.size.y }, (_, i) =>
      getWallSymbol(building.size.x, i + 0.5, EFaceDirection.EAST)
    );
    const northWalls = Array.from({ length: building.size.x }, (_, i) =>
      getWallSymbol(i + 0.5, 0, EFaceDirection.NORTH)
    );
    const westWalls = Array.from({ length: building.size.y }, (_, i) =>
      getWallSymbol(0, i + 0.5, EFaceDirection.WEST)
    );
    const southWalls = Array.from({ length: building.size.x }, (_, i) =>
      getWallSymbol(i + 0.5, building.size.y, EFaceDirection.SOUTH)
    );

    return {
      metadata: { floor },
      produces: [...northWalls, ...eastWalls, ...southWalls, ...westWalls],
    };
  },
};

const getAllowedWalls = (
  settings: TBuildingSettings,
  floor: number,
  direction: EFaceDirection,
  position: Vector2
) => {
  const groundFloor = floor === 0;
  const { building, walls } = settings;

  if (groundFloor && building.entrance === direction) {
    const doorPos = getDoorPosition(building, direction);

    if (Vector2.equals(position, doorPos)) {
      return [EWallType.DOOR];
    }
  }

  const allowedWalls: EWallType[] = [EWallType.EMPTY];

  if (building.windows && building.windows.includes(direction)) {
    allowedWalls.push(EWallType.WINDOW);
  }

  return allowedWalls.filter(
    (type) => !(walls && walls.disallowed.includes(type))
  );
};

const getDoorPosition = (
  building: TBuildingSettings['building'],
  direction: EFaceDirection
) => {
  switch (direction) {
    case EFaceDirection.NORTH:
      return { x: Math.floor(building.size.x / 2) + 0.5, y: 0 };
    case EFaceDirection.WEST:
      return { x: 0, y: Math.floor(building.size.y / 2) + 0.5 };
    case EFaceDirection.SOUTH:
      return { x: Math.floor(building.size.x / 2) + 0.5, y: building.size.y };
    case EFaceDirection.EAST:
      return { x: building.size.x, y: Math.floor(building.size.y / 2) + 0.5 };
  }
};
