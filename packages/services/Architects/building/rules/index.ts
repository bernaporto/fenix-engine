import type {
  TGenerator,
  TProductionRule,
} from '@fenix-engine/utilities/data/Generator';
import { buildingRule } from './building';
import { roofRule, type TRoofMetadata } from './roof';
import { floorRule, type TFloorMetadata } from './floor';
import { wallRule, type TWallMetadata } from './wall';

export const registerRules = (generator: TGenerator) => {
  [buildingRule, floorRule, roofRule, wallRule].forEach((rule) =>
    generator.rules.register(rule as TProductionRule)
  );
};

export type { TFloorMetadata, TRoofMetadata, TWallMetadata };
