import { AxesHelper } from 'three';
import BuildingArchitect, {
  EFaceDirection,
  ERoofType,
  type TBuildingSettings,
} from '@fenix-engine/services/Architects/building';
import { Scene } from '@fenix-engine/core/Scene';
import { Unit } from '@fenix-engine/core/Units';
import { EWallVariant, theme } from './theme';

const config: TBuildingSettings = {
  seed: 3483909132.145484,
  building: {
    size: { x: 7, y: 5 },
    entranceOn: EFaceDirection.SOUTH,
    allowWindowsOn: [EFaceDirection.NORTH, EFaceDirection.SOUTH],
  },
  floors: {
    count: {
      min: 5,
    },
    mirror: true,
  },
  roof: {
    allowed: [ERoofType.FLAT],
  },
  walls: {
    variants: {
      window: [EWallVariant.SINGLE, EWallVariant.DOUBLE],
    },
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
