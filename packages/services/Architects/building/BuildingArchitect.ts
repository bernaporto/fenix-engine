import Generator from '@fenix-engine/utilities/data/Generator';
import {
  EBuildingRule,
  type TBuildingSettings,
  type TArchProject,
} from './types';
import { getBuilder } from './builder';
import { registerRules } from './rules';

const generator = Generator.create();
registerRules(generator);

const BuildingArchitect = {
  plan: (settings: TBuildingSettings): TArchProject => {
    const blueprint = generator.generate({
      settings,
      fromRule: EBuildingRule.BUILDING,
    });

    return {
      blueprint,
      build: getBuilder(blueprint),
    };
  },
};

export default BuildingArchitect;
