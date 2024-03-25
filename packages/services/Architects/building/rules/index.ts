import type {
  TGenerator,
  TProductionRule,
} from '@fenix-engine/utilities/data/Generator';
export type { EBuildingRule } from '../types';
import { buildingRule } from './building';
import { roofRule } from './roof';
import { floorRule } from './floor';
import { wallRule } from './wall';

export const registerRules = (generator: TGenerator) => {
  [buildingRule, floorRule, roofRule, wallRule].forEach((rule) =>
    generator.rules.register(rule as TProductionRule)
  );
};
