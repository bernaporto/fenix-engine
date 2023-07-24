import type { Object3D } from 'three';
import { Mesh } from 'three';
import { Material } from './Material';
import { MaterialConfig } from '../types';

export const applyMaterial = (
  obj: Object3D,
  material: Material | MaterialConfig | string
): void => {
  const mat = material instanceof Material ? material : Material.load(material);

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
