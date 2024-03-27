import Generator from '@fenix-engine/utilities/data/Generator';
import PRNG from '@fenix-engine/utilities/PRNG';
import {
  EBuildingRule,
  type TArchProject,
  type TBuildingSettings,
} from './types';
import { getBuilder } from './builder';
import { registerRules } from './rules';

const generator = Generator.create();
registerRules(generator);

export const BuildingArchitect = {
  plan: (settings: TBuildingSettings): TArchProject => {
    const defaultPRNG = PRNG.create(settings.seed);

    const blueprint = generator.generate({
      settings: {
        ...settings,
        defaultPRNG,
      },
      fromRule: EBuildingRule.BUILDING,
    });

    return {
      blueprint,
      build: getBuilder(blueprint, defaultPRNG),
    };
  },
};
