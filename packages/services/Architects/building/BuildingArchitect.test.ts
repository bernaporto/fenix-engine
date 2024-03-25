import BuildingArchitect from './BuildingArchitect';
import { EBuildingRule, ERoofType, EWallType } from './types';

describe('BuildingArchitect', () => {
  it('should plan a valid blueprint', () => {
    const { blueprint } = BuildingArchitect.plan({
      building: {
        size: { x: 1, y: 1 },
      },
      floors: {
        min: 1,
      },
      roof: {
        types: [ERoofType.FLAT],
      },
      wall: {
        types: [EWallType.EMPTY],
      },
    });

    expect(blueprint).toEqual({
      type: EBuildingRule.BUILDING,
      metadata: {
        size: { x: 1, y: 1 },
      },
      children: [
        {
          type: EBuildingRule.FLOOR,
          children: [
            {
              type: EBuildingRule.WALL,
              metadata: {
                type: EWallType.EMPTY,
              },
            },
            {
              type: EBuildingRule.WALL,
              metadata: {
                type: EWallType.EMPTY,
              },
            },
            {
              type: EBuildingRule.WALL,
              metadata: {
                type: EWallType.EMPTY,
              },
            },
            {
              type: EBuildingRule.WALL,
              metadata: {
                type: EWallType.EMPTY,
              },
            },
          ],
        },
        {
          type: EBuildingRule.ROOF,
          metadata: {
            type: ERoofType.FLAT,
          },
        },
      ],
    });
  });
});
