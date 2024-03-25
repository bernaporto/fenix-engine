import { sampleOne } from '@fenix-engine/utilities/misc';
import { EBuildingRule, ERoofType, type TBuildingRule } from '../types';

type TRoofMetadata = {
  type: ERoofType;
};

export const roofRule: TBuildingRule = {
  type: EBuildingRule.ROOF,
  apply: ({ roof }) => {
    const metadata: TRoofMetadata = {
      type: sampleOne(roof.types) ?? ERoofType.FLAT,
    };

    return { metadata };
  },
};
