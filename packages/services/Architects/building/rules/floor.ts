import { EBuildingRule, type TBuildingRule } from '../types';

export const floorRule: TBuildingRule = {
  type: EBuildingRule.FLOOR,
  apply: ({ building }) => {
    return {
      produces: [
        {
          type: EBuildingRule.WALL,
          count: (building.size.x + building.size.y) * 2,
        },
      ],
    };
  },
};
