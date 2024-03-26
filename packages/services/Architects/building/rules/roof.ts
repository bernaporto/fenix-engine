import PRNG from '@fenix-engine/utilities/PRNG';
import type { Vector3 } from '@fenix-engine/core/Math';
import { EBuildingRule, ERoofType, type TBuildingRule } from '../types';

type TRoofPayload = {
  position: Vector3;
};

export type TRoofMetadata = {
  position: Vector3;
  type: ERoofType;
};

export const roofRule: TBuildingRule<TRoofPayload> = {
  type: EBuildingRule.ROOF,
  apply: ({ roof }, { position }) => {
    const metadata: TRoofMetadata = {
      position,
      type: (roof?.allowed && PRNG.choices(roof.allowed)) ?? ERoofType.FLAT,
    };

    return { metadata };
  },
};
