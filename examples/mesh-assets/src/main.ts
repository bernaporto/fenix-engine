import { game } from '@fenix-engine/core';

game.behaviours.register('orbit', (unit) => ({
  onUpdate: ({ deltaTime }) => {
    unit.transform.rotateY(15 * deltaTime);
  },
}));

game.init({
  containerId: 'game',
  initialScene: 'scene',
  manifest: 'assets/manifest.json',
});
