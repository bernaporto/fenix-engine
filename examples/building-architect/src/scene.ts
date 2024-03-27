import { AxesHelper } from 'three';
import BuildingArchitect, {
  EFaceDirection,
  ERoofType,
} from '@fenix-engine/services/Architects/building';
import { Scene } from '@fenix-engine/core/Scene';
import { Unit } from '@fenix-engine/core/Units';
import { theme } from './theme';

export const initScene = (scene: Scene) => {
  const building = BuildingArchitect.plan({
    seed: 1389734156395,
    building: {
      size: { x: 7, y: 3 },
      entrance: EFaceDirection.SOUTH,
      windows: [
        EFaceDirection.NORTH,
        EFaceDirection.EAST,
        EFaceDirection.SOUTH,
        EFaceDirection.WEST,
      ],
    },
    floors: {
      min: 4,
    },
    roof: {
      allowed: [ERoofType.FLAT],
    },
  }).build(theme);

  scene.append(building);

  addAxisHeplers(scene);
};

const addAxisHeplers = (scene: Scene) => {
  const axesHelper = new AxesHelper(5);
  const unit = new Unit();
  unit.node.add(axesHelper);
  scene.append(unit);
};
