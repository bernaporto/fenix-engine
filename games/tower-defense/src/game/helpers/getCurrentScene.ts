import { game } from '@fenix-engine/core';
import { Scene } from '@fenix-engine/core/Scene';

export const getCurrentScene = (): Scene => {
  const scene = game.stage.currentScene;

  if (!scene) {
    throw new Error('No scene found');
  }

  return scene;
};
