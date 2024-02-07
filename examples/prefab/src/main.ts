import { game } from '@fenix-engine/core';
import { Vector3 } from '@fenix-engine/core/Math';
import { Puppet } from '@fenix-engine/core/Units';
import { PathFollower } from '@fenix-engine/services/Path';
import Stats from 'stats.js';

game.behaviours.register('orbit', (unit) => ({
  onUpdate: ({ deltaTime }) => unit.transform.rotateY(-6 * deltaTime),
}));

game.behaviours.register('pathFollower', (unit) => {
  if (!(unit instanceof Puppet)) return;

  const currentScene = game.stage.currentScene;
  if (!currentScene) {
    throw new Error('No scene found');
  }

  const path = currentScene.properties.get<Vector3[]>('path');

  if (!path) {
    throw new Error('No path found in scene properties');
  }

  const pathFollower = new PathFollower({
    path,
    speed: 0.8,
  });

  return {
    onLoad: () => {
      unit.puppeteer.play('goblin@run');
    },

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
  initialScene: 'scene',
  manifest: 'assets/manifest.json',
});

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

game.events.on('beforeRender', () => stats.begin());
game.events.on('afterRender', () => stats.end());
