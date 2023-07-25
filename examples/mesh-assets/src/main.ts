import { BehaviourRegistry, Game } from '@fenix-engine/core';

BehaviourRegistry.add('orbit', {
  behaviour: (unit) => {
    const unsubscribe = unit.on('update', ({ deltaTime }) => {
      unit.transform.rotateY(15 * deltaTime);
    });

    return {
      dispose: unsubscribe,
    };
  },
});

(async function init() {
  const game = new Game({
    manifest: '/assets/manifest.json',
    container: document.getElementById('game')!,
    backgroundColor: 0x242424,
  });

  game.load();
})();
