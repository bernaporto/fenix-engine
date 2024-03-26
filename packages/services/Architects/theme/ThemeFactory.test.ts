import ThemeFactory from '.';

describe('ThemeFactory', () => {
  it('should create a theme with rules.', () => {
    const theme = ThemeFactory.create();

    const rule = theme.rule('floor');
    rule.add(
      {
        asset: 'room.png',
      },
      {
        asset: 'wall.png',
      }
    );

    expect(theme.list()).toStrictEqual(['floor']);
    expect(rule.get()).toStrictEqual([
      {
        asset: 'room.png',
      },
      {
        asset: 'wall.png',
      },
    ]);
  });

  it('should create a theme with rules and modifiers.', () => {
    const theme = ThemeFactory.create();

    const rule = theme.rule('floor', ['empty']);
    rule.add(
      {
        asset: 'room.png',
      },
      {
        asset: 'wall.png',
      }
    );

    expect(theme.list()).toStrictEqual(['floor:empty']);
    expect(rule.get()).toStrictEqual([
      {
        asset: 'room.png',
      },
      {
        asset: 'wall.png',
      },
    ]);
  });

  it('should gracefully return an empty array if no rules are found.', () => {
    const theme = ThemeFactory.create();

    const rule = theme.rule('floor');
    expect(rule.get()).toStrictEqual([]);
  });
});
