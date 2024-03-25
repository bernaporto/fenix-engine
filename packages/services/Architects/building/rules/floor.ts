import { EBuildingRule, type TBuildingRule } from '../types';

type TFloorPayload = {
  level: number;
};

export const floorRule: TBuildingRule<TFloorPayload> = {
  type: EBuildingRule.FLOOR,
  apply: (
    { building },
    {
      /* level */
    }
  ) => {
    const wallCount = building.size.x * 2 + building.size.y * 2;

    return {
      produces: Array.from({ length: wallCount }, () => ({
        type: EBuildingRule.WALL,
        payload: {
          /* typeOverride: EWallType.DOOR */
        },
      })),
    };
  },
};
