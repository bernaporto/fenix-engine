import type { Object3D } from 'three';
import { Mesh } from 'three';
import type { MeshUnitConfig } from '../../@types';
import { getMaterial } from './material';

export const applyMeshConfig = (
  obj: Object3D,
  config: MeshUnitConfig,
): void => {
  const {
    material: materialConfig,
    castShadow,
    receiveShadow,
  } = {
    castShadow: false,
    receiveShadow: false,
    ...config,
  };

  const applyConfig = (child: Object3D) => {
    if (isMesh(child)) {
      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;

      const material = getMaterial(materialConfig);

      if (material === null) {
        throw new Error(`Material "${materialConfig}" not found`);
      }

      if (material) {
        child.material = material.build();
      }
    }
  };

  applyConfig(obj);
  obj.traverse(applyConfig);
};

const isMesh = (obj: Object3D): obj is Mesh =>
  obj instanceof Mesh || (obj as any).isMesh;
