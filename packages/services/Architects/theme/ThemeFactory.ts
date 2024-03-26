import { isNotNullable } from '@fenix-engine/utilities/misc';
import type { TTheme, TThemeItem, TThemeRule } from './types';

const create = (): TTheme => {
  const registry = new Map<string, Set<TThemeItem>>();

  const getRuleController = (rule: string): TThemeRule => {
    return {
      add(...values): void {
        const set = registry.get(rule) ?? new Set();

        if (!registry.has(rule)) {
          registry.set(rule, set);
        }

        values.forEach((value) => set.add(value));
      },

      get() {
        const set = registry.get(rule);

        return set ? [...set] : [];
      },
    };
  };

  return {
    rule(rule, modifiers = []) {
      return getRuleController(getRuleId(rule, modifiers));
    },

    list() {
      return [...registry.keys()];
    },
  };
};

const getRuleId = (rule: string, modifiers: string[]): string =>
  [rule, ...modifiers].filter(isNotNullable).join(':');

export const ThemeFactory = {
  create,
};
