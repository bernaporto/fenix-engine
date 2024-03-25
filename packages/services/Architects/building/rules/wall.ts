import { sampleOne } from '@fenix-engine/utilities/misc';
import { EBuildingRule, EWallType, type TBuildingRule } from '../types';

type TWallMetadata = {
  type: EWallType;
};

type TWallPayload = {
  typeOverride?: EWallType;
};

export const wallRule: TBuildingRule<TWallPayload> = {
  type: EBuildingRule.WALL,
  apply: ({ wall }, { typeOverride }) => {
    const metadata: TWallMetadata = {
      type: typeOverride ?? sampleOne(wall.types) ?? EWallType.EMPTY,
    };

    return { metadata };
  },
};
