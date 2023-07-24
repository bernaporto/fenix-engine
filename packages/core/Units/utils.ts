import type { Object3D } from 'three';
import { Mesh } from 'three';
import { Material } from './Material';

export const applyMaterial = (
  obj: Object3D,
  material: Material | string
): void => {
  const mat = typeof material === 'string' ? Material.load(material) : material;

  if (mat === null) {
    throw new Error(`Material "${material}" not found`);
  }

  obj.traverse((child) => {
    if (isMesh(child)) {
      child.material = mat.build();
    }
  });
};

const isMesh = (obj: Object3D): obj is Mesh =>
  obj instanceof Mesh || (obj as any).isMesh;
