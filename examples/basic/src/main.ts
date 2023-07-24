import { BehaviourRegistry, Game } from '@fenix-engine/core';
import { Vector3 } from '@fenix-engine/core/Math';
import { Box, Material } from '@fenix-engine/core/Units';

const game = new Game({
  container: document.getElementById('game')!,
  backgroundColor: 0x242424,
});

BehaviourRegistry.add('bounce', {
  type: 'prop',
  behaviour: (prop) => {
    const SPEED = 5;
    const SCALE = 5;

    const unsubscribe = prop.on('update', ({ elapsedTime }) => {
      const movement = Vector3.project(
        Vector3.up,
        Math.sin(elapsedTime * SPEED)
      );

      prop.transform.setPosition(Vector3.multiplyScalar(movement, SCALE));
    });

    return {
      dispose: () => {
        unsubscribe();
      },
    };
  },
});

const scene = game.stage.load('basic-scene');
scene.camera.transform.setPosition({
  x: 0,
  y: 0,
  z: 5,
});

const box = new Box({
  material: new Material({ type: 'basic', color: 0x00ff00 }),
});
scene.append(box);

// Add the 'bounce' behaviour
box.addBehaviour('bounce');
// Amd remove it after 10 seconds
setTimeout(() => {
  box.removeBehaviour('bounce');
}, 10_000);
