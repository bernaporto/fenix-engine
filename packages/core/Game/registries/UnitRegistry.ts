import { makeRegistry } from '@fenix-engine/utilities/misc';
import {
  Box,
  Camera,
  Light,
  Plane,
  Prefab,
  Prop,
  Puppet,
  Sphere,
  Unit,
} from '../../Units';

type UnitConstructor = new (config?: any) => Unit;

export const UnitRegistry = makeRegistry<UnitConstructor>();

UnitRegistry.add('box', Box);
UnitRegistry.add('camera', Camera);
UnitRegistry.add('light', Light);
UnitRegistry.add('plane', Plane);
UnitRegistry.add('prefab', Prefab);
UnitRegistry.add('prop', Prop);
UnitRegistry.add('puppet', Puppet);
UnitRegistry.add('sphere', Sphere);
UnitRegistry.add('unit', Unit);
