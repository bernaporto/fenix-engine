import { Registry, makeRegistry } from '@fenix-engine/utilities/misc';
import type {
  TAnySettings,
  TGenerator,
  TProductionItem,
  TProductionRule,
} from './types';

export const createSubtractive = (): TGenerator => {
  const registry = makeRegistry<TProductionRule>();

  return {
    generate: ({ fromRule, settings }) =>
      handleRule(registry, fromRule, settings),

    rules: {
      register: (rule) => registry.add(rule.type, rule),
    },
  };
};

const handleRule = (
  registry: Registry<TProductionRule>,
  type: string,
  settings: TAnySettings = {}
): TProductionItem => {
  const rule = registry.get(type);

  if (!rule) {
    throw new Error(
      `[Generator] Failed to get rule of type '${type}'. Was it registered?`
    );
  }

  if (rule.terminal) {
    const { metadata } = rule.apply(settings);

    return {
      type,
      metadata,
    };
  }

  const { metadata, produces } = rule.apply(settings);

  const children = produces.flatMap(({ type, count = 1 }) =>
    Array.from({ length: count }).map(() =>
      handleRule(registry, type, settings)
    )
  );

  return {
    type,
    metadata,
    children,
  };
};
