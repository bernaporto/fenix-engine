import type { TPRNG } from '@fenix-engine/utilities/PRNG';
import { Vector2, type Vector3 } from '@fenix-engine/core/Math';
import {
  EBuildingRule,
  EFaceDirection,
  EWallType,
  TBuildingSettings,
  type TBuildingRule,
} from '../types';
import { offsetByDirection } from './utils';

export type TWallMetadata = {
  direction: EFaceDirection;
  type: EWallType;
  position: Vector3;
};

type TWallPayload = {
  direction: EFaceDirection;
  floor: number;
  prng: TPRNG;
  position: Vector2;
};

export const wallRule: TBuildingRule<TWallPayload> = {
  type: EBuildingRule.WALL,
  apply: (settings, { floor, position, direction, prng }) => {
    const types = getAllowedWalls(settings, floor, position, direction);
    const pos = offsetByDirection(position, direction, 0.5);

    const metadata: TWallMetadata = {
      direction,
      position: { x: pos.x, y: floor, z: pos.y },
      type: prng.choices(types) ?? EWallType.EMPTY,
    };

    return { metadata };
  },
};

const getAllowedWalls = (
  settings: TBuildingSettings,
  floor: number,
  position: Vector2,
  direction: EFaceDirection
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
      return { x: Math.floor(building.size.x / 2), y: 0 };
    case EFaceDirection.WEST:
      return { x: 0, y: Math.floor(building.size.y / 2) };
    case EFaceDirection.SOUTH:
      return { x: Math.floor(building.size.x / 2), y: building.size.y };
    case EFaceDirection.EAST:
      return { x: building.size.x, y: Math.floor(building.size.y / 2) };
  }
};
