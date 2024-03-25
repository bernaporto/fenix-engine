import { Registry, makeRegistry } from '@fenix-engine/utilities/misc';
import type {
  TDataMap,
  TGenerator,
  TProductionItem,
  TProductionRule,
  TValidationFn,
} from './types';

type TGeneratorConfig = {
  validateFn?: TValidationFn;
  maxIterations?: number;
};

const create = (config?: TGeneratorConfig): TGenerator => {
  const registry = makeRegistry<TProductionRule>();

  return {
    generate: ({ fromRule, settings }) =>
      handleRule({
        registry,
        settings,
        type: fromRule,
        validate: config?.validateFn,
        maxIterations: config?.maxIterations,
      }),

    rules: {
      register: (rule) => registry.add(rule.type, rule as TProductionRule),
    },
  };
};

const handleRule = ({
  registry,
  type,
  validate,
  maxIterations = 10,
  settings = {},
}: {
  registry: Registry<TProductionRule>;
  type: string;
  maxIterations?: number;
  settings?: TDataMap;
  validate?: TValidationFn;
}): TProductionItem => {
  const rule = registry.get(type);

  if (!rule) {
    throw new Error(
      `[Generator] Failed to get rule of type '${type}'. Was it registered?`
    );
  }

  if (rule.terminal) {
    const { metadata } = validate
      ? applyRuleWithValidation(
          type,
          rule.apply,
          validate,
          maxIterations,
          settings
        )
      : rule.apply(settings);

    return {
      type,
      metadata,
    };
  }

  const { metadata, produces } = validate
    ? applyRuleWithValidation(
        type,
        rule.apply,
        validate,
        maxIterations,
        settings
      )
    : rule.apply(settings);

  const children = produces.flatMap(({ type, count = 1 }) =>
    Array.from({ length: count }).map(() =>
      handleRule({ registry, type, validate, maxIterations, settings })
    )
  );

  return {
    type,
    metadata,
    children,
  };
};

const applyRuleWithValidation = <T extends { metadata?: TDataMap }>(
  type: string,
  apply: (settings: TDataMap) => T,
  validate: TValidationFn,
  maxIterations: number,
  settings: TDataMap = {}
) => {
  const isValid = (result: T) => {
    return result.metadata ? validate(type, result.metadata) : true;
  };
  let attempts = 1;

  while (attempts < maxIterations - 1) {
    const result = apply(settings);
    const valid = isValid(result);

    if (valid) {
      return result;
    }

    attempts++;
  }

  return apply(settings);
};

export const Generator = {
  create,
};
