import { makeRegistry } from '@fenix-engine/utilities/misc';
import type { Unit } from '../../Units';

type UnitConstructor = new (config?: any) => Unit;

export const UnitRegistry = makeRegistry<UnitConstructor>();
