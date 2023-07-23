import type { Material, Object3D } from 'three';
import { Mesh } from 'three';

export const applyMaterial = (obj: Object3D, material: Material): void => {
  obj.traverse((child) => {
    if (isMesh(child)) {
      child.material = material;
    }
  });
};

const isMesh = (obj: Object3D): obj is Mesh =>
  obj instanceof Mesh || (obj as any).isMesh;
