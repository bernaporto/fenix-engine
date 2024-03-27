import { TBlueprint, TBuildingSettings } from '../types';
import { strategies as floorStrategy } from './floor.strategies';

export const applyStrategies = (
  settings: TBuildingSettings,
  blueprint: TBlueprint
) => {
  const { building, floors } = settings;

  /* FLOOR */
  if (floors.mirror) {
    floorStrategy.mirror(blueprint, building.size);
  }
};
