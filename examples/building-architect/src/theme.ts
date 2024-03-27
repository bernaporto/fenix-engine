import { Material } from '@fenix-engine/core/Units';
import {
  EBuildingRule,
  EWallType,
  ERoofType,
  ETileType,
} from '@fenix-engine/services/Architects/building';
import ThemeFactory from '@fenix-engine/services/Architects/theme';

export const theme = ThemeFactory.create();
const material = new Material({
  type: 'basic',
  vertexColors: true,
});

/* WALLS */
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

/* ROOF */
theme.rule(EBuildingRule.ROOF, [ERoofType.FLAT, ETileType.CORNER]).add({
  material,
  asset: 'assets/buildings/sample/roof_corner.obj',
});

theme.rule(EBuildingRule.ROOF, [ERoofType.FLAT, ETileType.EDGE]).add({
  material,
  asset: 'assets/buildings/sample/roof_side.obj',
});

theme.rule(EBuildingRule.ROOF, [ERoofType.FLAT, ETileType.CENTER]).add({
  material,
  asset: 'assets/buildings/sample/roof_center.obj',
});
