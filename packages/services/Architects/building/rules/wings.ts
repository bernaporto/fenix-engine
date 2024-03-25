import { random } from '@fenix-engine/utilities/misc';
import { EBuildingRule, type TBuildingRule } from '../types';

export const wingsRule: TBuildingRule = {
  type: EBuildingRule.WINGS,
  apply: ({ building, wings }) => {
    const count = wings.count.max
      ? random(wings.count.min, wings.count.max)
      : wings.count.min;

    // TODO: implement wing distribution algorithms

    return {
      produces: [{ count, type: EBuildingRule.WING }],
    };
  },
};

export const wingRule: TBuildingRule = {
  type: EBuildingRule.WING,
  apply: ({ wing }) => {
    const count = wing.floors.max
      ? random(wing.floors.min, wing.floors.max)
      : wing.floors.min;

    return {
      produces: [{ count, type: EBuildingRule.FLOOR }],
    };
  },
};
