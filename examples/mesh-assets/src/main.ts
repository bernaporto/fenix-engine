import { game } from '@fenix-engine/core';

game.behaviours.register('orbit', (unit) => ({
  onUpdate: ({ deltaTime }) => {
    unit.transform.rotateY(15 * deltaTime);
  },
}));

void game
  .init({
    containerId: 'game',
    manifest: 'assets/manifest.json',
    autoLoad: { sceneKey: 'scene' },
  })
  .then(async ({ scenePromise }) => {
    if (!scenePromise) throw new Error('The initial scene was not loaded.');
    await scenePromise;
  })
  .catch((error: unknown) => {
    console.error('Failed to start the mesh assets example', error);
  });
