import type { Camera } from '@fenix-engine/core/Units';
import { getCurrentScene } from './getCurrentScene';

export const getCurrentCamera = (): Camera => {
  const scene = getCurrentScene();

  if (!scene.camera) {
    throw new Error('No camera found');
  }

  return scene.camera;
};
