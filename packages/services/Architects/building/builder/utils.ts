import type { Vector2, Vector3 } from '@fenix-engine/core/Math';
import { Material, Prop } from '@fenix-engine/core/Units';
import type { TThemeItem } from '../../theme/types';
import { EFaceDirection } from '../types';
import type { TBuildingMetadata, TRoofMetadata, TWallMetadata } from '../rules';

export const buildAndAppend = (
  themeItem: TThemeItem,
  building: TBuildingMetadata,
  metadata: TRoofMetadata | TWallMetadata
) => {
  const {
    asset,
    material = new Material({
      type: 'standard',
      side: 2,
    }),
  } = themeItem;

  const prop = new Prop({ material, path: asset });
  applyTransformations(prop, building.size, metadata);

  return prop;
};

const applyTransformations = (
  prop: Prop,
  buildingSize: Vector2,
  metadata?: { position: Vector3; direction?: EFaceDirection }
) => {
  if (!metadata) return;

  const position3D = {
    x: metadata.position.x - buildingSize.x / 2,
    y: metadata.position.y,
    z: metadata.position.z - buildingSize.y / 2,
  };
  prop.transform.setPosition(position3D);

  switch (metadata.direction) {
    case EFaceDirection.SOUTH:
      prop.transform.rotateY(0);
      break;
    case EFaceDirection.EAST:
      prop.transform.rotateY(90);
      break;
    case EFaceDirection.NORTH:
      prop.transform.rotateY(180);
      break;
    case EFaceDirection.WEST:
      prop.transform.rotateY(270);
      break;
  }
};
