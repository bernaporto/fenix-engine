import { makeRegistry } from '@fenix-engine/utilities/misc';

export const initialize = () => {
  const themeRegistry = makeRegistry<unknown>();
  const ruleRegistry = makeRegistry<unknown>();

  return {
    ruleRegistry,
    themeRegistry,
  };
};
