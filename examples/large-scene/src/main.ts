import { game } from '@fenix-engine/core';
import { handleSpawnEnemies } from './handleSpawnEnemies';
import { registerBehaviours } from './behaviours/registerBehaviours';
import { setupStats } from './setupStats';

const init = async () => {
  setupStats();
  registerBehaviours();

  const { initialScene } = await game.init({
    containerId: 'game',
    manifest: 'assets/manifest.json',
  });

  const scene = await game.stage.load(initialScene ?? 'main');

  handleSpawnEnemies(scene);
};

init();
