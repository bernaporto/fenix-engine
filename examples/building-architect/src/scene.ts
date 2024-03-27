import { AxesHelper } from 'three';
import BuildingArchitect, {
  EFaceDirection,
  ERoofType,
  type TBuildingSettings,
} from '@fenix-engine/services/Architects/building';
import { Scene } from '@fenix-engine/core/Scene';
import { Unit } from '@fenix-engine/core/Units';
import { theme } from './theme';

const config: TBuildingSettings = {
  seed: 124390050350.37036,
  building: {
    size: { x: 6, y: 3 },
    entranceOn: EFaceDirection.SOUTH,
    allowWindowsOn: [
      EFaceDirection.NORTH,
      EFaceDirection.EAST,
      EFaceDirection.SOUTH,
      EFaceDirection.WEST,
    ],
  },
  floors: {
    // strategy: 'random',
    count: {
      min: 4,
    },
    mirror: true,
  },
  roof: {
    allowed: [ERoofType.FLAT],
  },
};
export const initScene = (scene: Scene) => {
  addAxisHeplers(scene);

  const building = BuildingArchitect.build(config, theme);
  // console.log(building.seed);
  scene.append(building.unit);
};

const addAxisHeplers = (scene: Scene) => {
  const axesHelper = new AxesHelper(5);
  const unit = new Unit();
  unit.node.add(axesHelper);
  scene.append(unit);
};
