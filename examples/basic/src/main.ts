import { game } from '@fenix-engine/core';
import { Vector3 } from '@fenix-engine/core/Math';

game.behaviours.register('bounce', {
  behaviour: (unit) => {
    const SPEED = 5;
    const SCALE = 5;

    const unsubscribe = unit.on('update', ({ elapsedTime }) => {
      const movement = Vector3.project(
        Vector3.up,
        Math.sin(elapsedTime * SPEED)
      );

      unit.transform.setPosition(Vector3.multiplyScalar(movement, SCALE));
    });

    return {
      dispose: unsubscribe,
    };
  },
});

game.init({
  containerId: 'game',
  manifest: 'assets/manifest.json',
});
