import { sampleOne } from '@fenix-engine/utilities/misc';
import { EBuildingRule, type TBuildingRule } from '../types';

export const wallRule: TBuildingRule = {
  type: EBuildingRule.WALL,
  terminal: true,
  apply: ({ wall }) => {
    return {
      metadata: {
        type: sampleOne(wall.types),
      },
    };
  },
};
