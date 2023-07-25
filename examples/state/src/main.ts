import { game } from '@fenix-engine/core';
import { PathFollower } from '@fenix-engine/services/Pathfinding';
import type { Vector3 } from '@fenix-engine/core/Math';

game.behaviours.register('orbit', {
  behaviour: (unit) => {
    unit.on('update', ({ deltaTime }) => {
      unit.transform.rotateY(-6 * deltaTime);
    });

    return null;
  },
});

game.behaviours.register('pathFollower', {
  type: 'puppet',
  behaviour: (puppet) => {
    const currentScene = game.stage.currentScene;
    if (!currentScene) return null;

    const path = currentScene.store.get('path') as Vector3[];
    const pathFollower = new PathFollower({
      path,
      speed: 0.8,
    });

    puppet.on('load', () => puppet.puppeteer.play('goblin@run'));

    puppet.on('update', ({ deltaTime }) => {
      if (!pathFollower) return;

      const { done, nextNodePos, position, travelledDistance } =
        pathFollower.getNextPosition(deltaTime, puppet.transform.position);

      puppet.transform.setPosition(position);
      puppet.transform.lookAt(nextNodePos);

      pathFollower.setTravelledDistance(travelledDistance);

      if (done) {
        pathFollower.setTravelledDistance(0);
      }
    });

    return null;
  },
});

game.init({
  containerId: 'game',
  manifest: 'assets/manifest.json',
});
