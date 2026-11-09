import { Game } from '@fenix-engine/core';
import { Vector3 } from '@fenix-engine/core/Math';

const game = new Game();

game.behaviours.register('bounce', (unit) => {
  const SPEED = 5;
  const SCALE = 5;

  return {
    onUpdate: ({ elapsedTime }) => {
      const movement = Vector3.multiplyScalar(
        Vector3.up,
        Math.sin(elapsedTime * SPEED),
      );

      unit.transform.setPosition(Vector3.multiplyScalar(movement, SCALE));
    },
  };
});

void game
  .init({
    containerId: 'game',
    manifest: 'assets/manifest.json',
    autoLoad: { sceneKey: 'basic-scene' },
  })
  .then(async ({ scenePromise }) => {
    if (!scenePromise) throw new Error('The initial scene was not loaded.');
    await scenePromise;
  })
  .catch((error: unknown) => {
    console.error('Failed to start the basic example', error);
  });
