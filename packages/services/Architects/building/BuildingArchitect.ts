import Generator from '@fenix-engine/utilities/data/Generator';
import PRNG from '@fenix-engine/utilities/PRNG';
import type { TTheme } from '../theme';
import {
  EBuildingRule,
  type TArchProject,
  type TBuildingSettings,
} from './types';
import { build } from './builder';
import { registerRules } from './rules';

const generator = Generator.create();
registerRules(generator);

export const BuildingArchitect = {
  build: (settings: TBuildingSettings, theme: TTheme): TArchProject => {
    const defaultPRNG = PRNG.create(
      settings.seed ?? Date.now() * Math.random(),
    );

    const blueprint = generator.generate({
      settings: {
        ...settings,
        defaultPRNG,
        seed: defaultPRNG.seed.get(),
      },
      fromRule: EBuildingRule.BUILDING,
    });

    return {
      seed: defaultPRNG.seed.get(),
      unit: build(settings, blueprint, theme, defaultPRNG),
    };
  },
};
