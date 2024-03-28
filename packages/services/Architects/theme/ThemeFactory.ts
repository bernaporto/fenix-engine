import { isNotNullable } from '@fenix-engine/utilities/misc';
import type { TTheme, TThemeItem, TThemeRule } from './types';

const create = (): TTheme => {
  const registry = new Map<string, Set<TThemeItem>>();

  const getRuleController = (rule: string): TThemeRule => {
    return {
      get id() {
        return rule;
      },

      add(...values) {
        const set = registry.get(rule) ?? new Set();

        if (!registry.has(rule)) {
          registry.set(rule, set);
        }

        values.forEach((value) => set.add(value));

        return rule;
      },

      get() {
        const set = registry.get(rule);

        return set ? [...set] : [];
      },
    };
  };

  return {
    rule(rule, variants = []) {
      return getRuleController(getRuleId(rule, variants));
    },

    list() {
      return [...registry.keys()];
    },
  };
};

const getRuleId = (rule: string, variants: string[]): string =>
  [rule, ...variants].filter(isNotNullable).join(':');

export const ThemeFactory = {
  create,
};
