import { game } from '@fenix-engine/core';

game.behaviours.register('orbit', (unit) => ({
  onUpdate: ({ deltaTime }) => unit.transform.rotateY(-6 * deltaTime),
}));

game.init({
  containerId: 'game',
  initialScene: 'basic-scene',
  manifest: 'assets/manifest.json',
});
