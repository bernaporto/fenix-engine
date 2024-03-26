import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { game } from '@fenix-engine/core';
import BuildingArchitect, {
  EBuildingRule,
  EFaceDirection,
  ERoofType,
  EWallType,
} from '@fenix-engine/services/Architects/building';
import ThemeFactory from '@fenix-engine/services/Architects/theme';
import { Camera, Material } from '@fenix-engine/core/Units';

/* BEHAVIOURS */
game.behaviours.register('orbit', (unit) => {
  const camera = (unit as unknown as Camera).camera;
  const controls = new OrbitControls(camera, game.renderer.domElement);
  controls.enableDamping = true;

  return {
    onUpdate: () => {
      controls.update();
    },
    onDetach: () => controls.dispose(),
  };
});

/* THEME */
const theme = ThemeFactory.create();
const material = new Material({
  type: 'basic',
  vertexColors: true,
});
theme.rule(EBuildingRule.WALL, [EWallType.DOOR]).add({
  material,
  asset: 'assets/buildings/sample/wall_doorA.obj',
});

theme.rule(EBuildingRule.WALL, [EWallType.EMPTY]).add({
  material,
  asset: 'assets/buildings/sample/wall_solid.obj',
});

theme.rule(EBuildingRule.WALL, [EWallType.WINDOW]).add(
  {
    material,
    asset: 'assets/buildings/sample/wall_windowA.obj',
  },
  {
    material,
    asset: 'assets/buildings/sample/wall_windowC.obj',
  }
);

theme.rule(EBuildingRule.ROOF, [ERoofType.FLAT]).add({
  material,
  asset: 'assets/buildings/sample/roof_center.obj',
});

/* GAME */
game
  .init({
    containerId: 'game',
    manifest: 'assets/manifest.json',
  })
  .then(async () => {
    const scene = await game.stage.load('basic-scene');

    const building = BuildingArchitect.plan({
      building: {
        size: { x: 10, y: 3 },
        entrance: EFaceDirection.SOUTH,
        windows: [
          EFaceDirection.SOUTH,
          EFaceDirection.WEST,
          EFaceDirection.NORTH,
          EFaceDirection.EAST,
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
  });
