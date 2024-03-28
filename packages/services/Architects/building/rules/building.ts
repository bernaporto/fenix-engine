import { EBuildingRule, type TBuildingRule } from '../types';

export const buildingRule: TBuildingRule = {
  type: EBuildingRule.BUILDING,
  apply: (settings) => {
    const { building, defaultPRNG, floors } = settings;

    /* FLOORS */
    const { count } = floors;

    const totalFloors = count.max
      ? defaultPRNG.rangeInt(count.min, count.max)
      : count.min;

    const floorSymbols = Array.from({ length: totalFloors }, (_, floor) => ({
      type: EBuildingRule.FLOOR,
      payload: { floor },
    }));

    /* ROOF */
    const roofPartsCount = building.size.x * building.size.y;
    const roofSymbols = Array.from({ length: roofPartsCount }, (_, i) => ({
      type: EBuildingRule.ROOF,
      payload: {
        roofLevel: totalFloors,
        position: {
          x: i % building.size.x,
          y: Math.floor(i / building.size.x),
        },
      },
    }));

    return {
      produces: [...floorSymbols, ...roofSymbols],
    };
  },
};
