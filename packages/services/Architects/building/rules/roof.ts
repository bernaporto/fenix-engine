import PRNG from '@fenix-engine/utilities/PRNG';
import { Vector2, Vector3 } from '@fenix-engine/core/Math';
import {
  EBuildingRule,
  EFaceDirection,
  ERoofType,
  ETileType,
  type TBuildingRule,
} from '../types';
import { getFacingDirection, getTileType } from './utils';

type TRoofPayload = {
  roofLevel: number;
  position: Vector2;
};

export type TRoofMetadata = {
  position: Vector3;
  tileType: ETileType;
  type: ERoofType;
  direction?: EFaceDirection;
};

export const roofRule: TBuildingRule<TRoofPayload> = {
  type: EBuildingRule.ROOF,
  apply: ({ building, roof }, { position, roofLevel }) => {
    const worldPos = Vector2.add(position, { x: 0.5, y: 0.5 });
    const maxPos = Vector2.subtract(building.size, Vector2.one);
    const tileType = getTileType(position, maxPos);
    const direction =
      tileType !== ETileType.CENTER
        ? getFacingDirection(position, maxPos, tileType)
        : undefined;

    const metadata: TRoofMetadata = {
      tileType,
      direction,
      position: { x: worldPos.x, y: roofLevel, z: worldPos.y },
      type: (roof?.allowed && PRNG.choices(roof.allowed)) ?? ERoofType.FLAT,
    };

    return { metadata };
  },
};
