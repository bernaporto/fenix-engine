import { Vector2, Vector3 } from '@fenix-engine/core/Math';
import { Prop } from '@fenix-engine/core/Units';
import type { TThemeItem } from '../../theme';
import { EFaceDirection, TBuildingSettings } from '../types';
import type { TRoofMetadata, TWallMetadata } from '../rules';

export const buildProp = (
  themeItem: TThemeItem,
  settings: TBuildingSettings,
  metadata: TRoofMetadata | TWallMetadata,
) => {
  const { asset, config } = themeItem;

  const prop = new Prop({ ...config, path: asset });
  applyTransformations(prop, settings.building.size, metadata);

  return prop;
};

const applyTransformations = (
  prop: Prop,
  buildingSize: Vector2,
  metadata?: { position: Vector3; direction?: EFaceDirection },
) => {
  if (!metadata) return;

  const buildingOffset = {
    x: buildingSize.x / 2,
    y: 0,
    z: buildingSize.y / 2,
  };

  const position3D = Vector3.subtract(metadata.position, buildingOffset);
  prop.transform.setPosition(position3D);

  switch (metadata.direction) {
    case EFaceDirection.NORTH:
      prop.transform.rotateY(180);
      break;
    case EFaceDirection.EAST:
      prop.transform.rotateY(90);
      break;
    case EFaceDirection.SOUTH:
      prop.transform.rotateY(0);
      break;
    case EFaceDirection.WEST:
      prop.transform.rotateY(-90);
      break;
  }
};
