import { EBuildingRule, type TBuildingRule } from '../types';

export const buildingRule: TBuildingRule = {
  type: EBuildingRule.BUILDING,
  apply: (settings) => {
    const { building, defaultPRNG, floors, seed } = settings;

    /* FLOORS */
    const { count } = floors;
    const floorStrategy = floors.strategy ?? 'default';
    const floorSeed =
      floorStrategy === 'default'
        ? seed ?? Date.now() * Math.random()
        : undefined;
    const totalFloors = count.max
      ? defaultPRNG.rangeInt(count.min, count.max)
      : count.min;

    const floorSymbols = Array.from({ length: totalFloors }, (_, floor) => ({
      type: EBuildingRule.FLOOR,
      payload: { floor, seed: floorSeed },
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
