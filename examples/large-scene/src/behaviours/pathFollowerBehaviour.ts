import type { Behaviour } from '@fenix-engine/core/@types';
import type { Game } from '@fenix-engine/core';
import { PathFollower } from '@fenix-engine/services/Path';
import { Puppet } from '@fenix-engine/core/Units';
import type { Vector3 } from '@fenix-engine/core/Math';

export const pathFollowerBehaviour =
  (game: Game): Behaviour =>
  (unit) => {
    if (!(unit instanceof Puppet)) {
      throw new Error('Unit is not a puppet');
    }

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
      speed: 0.7,
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
          unit.dispose();
        }
      },
    };
  };
