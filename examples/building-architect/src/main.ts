import { game } from '@fenix-engine/core';
import { registerBehaviours } from './behaviours';
import { initScene } from './scene';

game
  .init({
    containerId: 'game',
    manifest: 'assets/manifest.json',
  })
  .then(async () => {
    registerBehaviours(game);

    const scene = await game.stage.load('basic-scene');

    initScene(scene);
  });
