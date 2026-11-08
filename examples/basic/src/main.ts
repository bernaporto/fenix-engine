import { game } from '@fenix-engine/core';
import { Vector3 } from '@fenix-engine/core/Math';

game.behaviours.register('bounce', (unit) => {
  const SPEED = 5;
  const SCALE = 5;

  return {
    onUpdate: ({ elapsedTime }) => {
      const movement = Vector3.project(
        Vector3.up,
        Math.sin(elapsedTime * SPEED),
      );

      unit.transform.setPosition(Vector3.multiplyScalar(movement, SCALE));
    },
  };
});

game.init({
  containerId: 'game',
  initialScene: 'basic-scene',
  manifest: 'assets/manifest.json',
});
