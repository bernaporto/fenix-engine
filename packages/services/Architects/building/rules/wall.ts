import { sampleOne } from '@fenix-engine/utilities/misc';
import type { Vector3 } from '@fenix-engine/core/Math';
import {
  EBuildingRule,
  EFaceDirection,
  EWallType,
  type TBuildingRule,
} from '../types';

export type TWallMetadata = {
  direction: EFaceDirection;
  type: EWallType;
  position: Vector3;
};

type TWallPayload = {
  direction: EFaceDirection;
  position: Vector3;
  types: EWallType[];
};

export const wallRule: TBuildingRule<TWallPayload> = {
  type: EBuildingRule.WALL,
  apply: (_, { position, types, direction }) => {
    const metadata: TWallMetadata = {
      direction,
      position,
      type: sampleOne(types) ?? EWallType.EMPTY,
    };

    return { metadata };
  },
};
