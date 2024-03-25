import type { TGenerator } from './types';
import { initialize } from './utils/initialize';

export const createAdditive = (): TGenerator => {
  const { ruleRegistry } = initialize();

  return {
    generate: () => {
      throw new Error(`[Generator] Additive generator is not implemented yet`);
    },

    rules: {
      register: (rule) => ruleRegistry.add(rule.type, rule),
    },
  };
};
