import { sampleOne } from '@fenix-engine/utilities/misc';
import { EBuildingRule, type TBuildingRule } from '../types';

export const roofRule: TBuildingRule = {
  type: EBuildingRule.ROOF,
  terminal: true,
  apply: ({ roof }) => {
    return {
      metadata: {
        type: sampleOne(roof.types),
      },
    };
  },
};
