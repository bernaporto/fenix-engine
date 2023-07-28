import { game } from '@fenix-engine/core';
import { Puppet } from '@fenix-engine/core/Units';
import { PathFollower } from '@fenix-engine/services/Path';
import Stats from 'stats.js';

game.behaviours.register('orbit', (unit) => ({
  onUpdate: ({ deltaTime }) => unit.transform.rotateY(-6 * deltaTime),
}));

game.behaviours.register('pathFollower', (unit) => {
  if (!(unit instanceof Puppet)) return;

  const currentScene = game.stage.currentScene;
  if (!currentScene) return;

  const path = currentScene.properties.path;

  if (!path) {
    throw new Error('No path found in scene properties');
  }

  const pathFollower = new PathFollower({
    path,
    speed: 0.8,
  });

  unit.events.on('load', () => unit.puppeteer.play('goblin@run'));

  return {
    onUpdate: ({ deltaTime }) => {
      const { done, nextNodePos, position, travelledDistance } =
        pathFollower.getNextPosition(deltaTime, unit.transform.position);

      unit.transform.setPosition(position);
      unit.transform.lookAt(nextNodePos);

      pathFollower.setTravelledDistance(travelledDistance);

      if (done) {
        pathFollower.setTravelledDistance(0);
      }
    },
  };
});

game.init({
  containerId: 'game',
  manifest: 'assets/manifest.json',
});

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

game.events.on('beforeRender', () => stats.begin());
game.events.on('afterRender', () => stats.end());
