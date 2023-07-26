import { game } from '@fenix-engine/core';
import { PathFollower } from '@fenix-engine/services/Pathfinding';
import Stats from 'stats.js';

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

    const path = currentScene.properties.path ?? [];
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

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

game.on('beforeRender', () => stats.begin());
game.on('afterRender', () => stats.end());
