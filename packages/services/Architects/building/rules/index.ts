import type { TGenerator } from '@fenix-engine/utilities/data/Generator';
export type { EBuildingRule } from '../types';
import { buildingRule } from './building';
import { roofRule } from './roof';
import { floorRule } from './floor';
import { wallRule } from './wall';
import { wingRule, wingsRule } from './wings';

export const registerRules = (generator: TGenerator) => {
  [buildingRule, floorRule, roofRule, wallRule, wingsRule, wingRule].forEach(
    (rule) => generator.rules.register(rule)
  );
};
