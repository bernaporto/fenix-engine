import type {
  TGenerator,
  TProductionRule,
} from '@fenix-engine/utilities/data/Generator';
import { buildingRule, type TBuildingMetadata } from './building';
import { roofRule, type TRoofMetadata } from './roof';
import { floorRule } from './floor';
import { wallRule, TWallMetadata } from './wall';

export const registerRules = (generator: TGenerator) => {
  [buildingRule, floorRule, roofRule, wallRule].forEach((rule) =>
    generator.rules.register(rule as TProductionRule)
  );
};

export type { TBuildingMetadata, TRoofMetadata, TWallMetadata };
