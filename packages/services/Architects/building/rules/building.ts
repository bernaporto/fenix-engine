import { EBuildingRule, type TBuildingRule } from '../types';

export const buildingRule: TBuildingRule = {
  type: EBuildingRule.BUILDING,
  apply: ({ building }) => {
    return {
      metadata: {
        size: building.size,
      },
      produces: [{ type: EBuildingRule.WINGS }],
    };
  },
};
