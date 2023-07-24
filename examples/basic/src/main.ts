import { BehaviourRegistry, Game } from '@fenix-engine/core';
import { Vector3 } from '@fenix-engine/core/Math';

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

(async function init() {
  const game = new Game({
    manifest: '/assets/manifest.json',
    container: document.getElementById('game')!,
    backgroundColor: 0x242424,
  });

  await game.load();

  game.stage.load('basic-scene');
})();
