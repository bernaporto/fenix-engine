import { TProductionRule } from '.';
import { Generator } from './Generator';

enum ERuleType {
  FLOOR = 'floor',
  ROOM = 'room',
  WALL = 'wall',
}

type TTestSettings = { wallCount: number };
type TTestRule = TProductionRule<TTestSettings>;

const floorRule: TTestRule = {
  type: ERuleType.FLOOR,
  apply: () => ({
    produces: [{ type: ERuleType.ROOM }],
  }),
};

const roomRule: TTestRule = {
  type: ERuleType.ROOM,
  apply: ({ wallCount }) => ({
    produces: [{ type: ERuleType.WALL, count: wallCount }],
  }),
};

const wallRule: TTestRule = {
  type: ERuleType.WALL,
  terminal: true,
  apply: () => ({
    metadata: {
      type: 'empty',
    },
  }),
};

describe('Generator', () => {
  it('should generate content with defined rules.', () => {
    const generator = Generator.create();

    [floorRule, roomRule, wallRule].forEach((rule) =>
      generator.rules.register(rule)
    );

    const result = generator.generate({
      fromRule: ERuleType.FLOOR,
      settings: {
        wallCount: 2,
      },
    });

    expect(result).toStrictEqual({
      type: 'floor',
      metadata: undefined,
      children: [
        {
          type: 'room',
          metadata: undefined,
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
          ],
        },
      ],
    });
  });

  it('should fail if a rule is not registered.', () => {
    const generator = Generator.create();

    [floorRule, roomRule].forEach((rule) => generator.rules.register(rule));

    expect(() => {
      generator.generate({ fromRule: ERuleType.FLOOR });
    }).toThrowError(
      "[Generator] Failed to get rule of type 'wall'. Was it registered?"
    );
  });
});
