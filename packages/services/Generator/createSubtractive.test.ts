import { createSubtractive } from './createSubtractive';

enum EBuildingRule {
  BUILDING = 'building',
  ROOF = 'roof',
  STORY = 'story',
  WALL = 'wall',
  WING = 'wing',
  WINGS = 'wings',
}

describe('createSubtractive', () => {
  it('should generate content with defined rules', () => {
    const generator = createSubtractive();

    generator.rules.register({
      type: EBuildingRule.BUILDING,
      apply: () => ({
        produces: [{ type: EBuildingRule.WINGS }],
        metadata: {
          size: { x: 10, y: 10 },
        },
      }),
    });

    generator.rules.register({
      type: EBuildingRule.WINGS,
      apply: () => ({
        produces: [{ type: EBuildingRule.WING }],
      }),
    });

    generator.rules.register({
      type: EBuildingRule.WING,
      apply: () => ({
        produces: [{ type: EBuildingRule.STORY }, { type: EBuildingRule.ROOF }],
        metadata: {
          position: { x: 0, y: 0 },
          size: { x: 5, y: 10 },
        },
      }),
    });

    generator.rules.register({
      type: EBuildingRule.STORY,
      apply: () => ({
        produces: [{ type: EBuildingRule.WALL, count: 4 }],
        metadata: {
          level: 0,
        },
      }),
    });

    generator.rules.register({
      type: EBuildingRule.WALL,
      terminal: true,
      apply: () => ({
        metadata: {
          type: 'empty',
        },
      }),
    });

    generator.rules.register({
      type: EBuildingRule.ROOF,
      terminal: true,
      apply: () => ({
        metadata: {
          type: 'flat',
          direction: 'north',
        },
      }),
    });

    const result = generator.generate({
      fromRule: 'building',
    });

    expect(result).toStrictEqual({
      type: 'building',
      metadata: {
        size: { x: 10, y: 10 },
      },
      children: [
        {
          type: 'wings',
          metadata: undefined,
          children: [
            {
              type: 'wing',
              metadata: {
                position: { x: 0, y: 0 },
                size: { x: 5, y: 10 },
              },
              children: [
                {
                  type: 'story',
                  metadata: {
                    level: 0,
                  },
                  children: [
                    {
                      type: 'wall',
                      metadata: {
                        type: 'empty',
                      },
                    },
                    {
                      type: 'wall',
                      metadata: {
                        type: 'empty',
                      },
                    },
                    {
                      type: 'wall',
                      metadata: {
                        type: 'empty',
                      },
                    },
                    {
                      type: 'wall',
                      metadata: {
                        type: 'empty',
                      },
                    },
                  ],
                },
                {
                  type: 'roof',
                  metadata: {
                    type: 'flat',
                    direction: 'north',
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
