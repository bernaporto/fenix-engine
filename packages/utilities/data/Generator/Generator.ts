import { makeRegistry, type Registry } from '../../misc';
import type {
  TDataMap,
  TGenerator,
  TProductionItem,
  TProductionRule,
} from './types';

const create = (): TGenerator => {
  const registry = makeRegistry<TProductionRule>();

  return {
    generate: ({ fromRule, settings }) =>
      handleRule({
        registry,
        settings,
        type: fromRule,
      }),

    rules: {
      register: (rule) => registry.add(rule.type, rule as TProductionRule),
    },
  };
};

const handleRule = ({
  registry,
  type,
  payload = {},
  settings = {},
}: {
  registry: Registry<TProductionRule>;
  type: string;
  payload?: TDataMap;
  settings?: TDataMap;
}): TProductionItem => {
  const rule = registry.get(type);

  if (!rule) {
    throw new Error(
      `[Generator] Failed to get rule of type '${type}'. Was it registered?`,
    );
  }

  const { metadata, produces } = rule.apply(settings, payload);

  const children = produces?.map(({ payload, type }) =>
    handleRule({ payload, registry, settings, type }),
  );

  return {
    type,
    metadata,
    children,
  };
};

export const Generator = {
  create,
};
