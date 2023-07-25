import { BehaviourRegistry, game } from '@fenix-engine/core';

BehaviourRegistry.add('orbit', {
  behaviour: (unit) => {
    const unsubscribe = unit.on('update', ({ deltaTime }) => {
      unit.transform.rotateY(10 * deltaTime);
    });

    return {
      dispose: unsubscribe,
    };
  },
});

game.init({
  containerId: 'game',
  manifest: '/assets/manifest.json',
});
