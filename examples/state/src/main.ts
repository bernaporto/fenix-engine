import { game } from '@fenix-engine/core';
import { TickerState } from '@fenix-engine/core/Tools/Ticker';
import type { Unit } from '@fenix-engine/core/Units';
import type { BehaviourController } from '@fenix-engine/core/types';
import { PathFollower } from '@fenix-engine/services/Path';
import Stats from 'stats.js';

class OrbitCamera implements BehaviourController {
  constructor(private unit: Unit) {}

  onUpdate({ deltaTime }: TickerState) {
    this.unit.transform.rotateY(-6 * deltaTime);
  }
}

game.behaviours.register('orbit', { behaviour: OrbitCamera });
game.behaviours.register('pathFollower', {
  type: 'puppet',
  behaviour: (puppet) => {
    const currentScene = game.stage.currentScene;
    if (!currentScene) return;

    const path = currentScene.properties.path ?? [];
    const pathFollower = new PathFollower({
      path,
      speed: 0.8,
    });

    puppet.events.on('load', () => puppet.puppeteer.play('goblin@run'));

    return {
      onUpdate: ({ deltaTime }) => {
        if (!pathFollower) return;

        const { done, nextNodePos, position, travelledDistance } =
          pathFollower.getNextPosition(deltaTime, puppet.transform.position);

        puppet.transform.setPosition(position);
        puppet.transform.lookAt(nextNodePos);

        pathFollower.setTravelledDistance(travelledDistance);

        if (done) {
          pathFollower.setTravelledDistance(0);
        }
      },
    };
  },
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
