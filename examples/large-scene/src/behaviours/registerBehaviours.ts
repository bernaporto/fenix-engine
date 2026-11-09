import type { Game } from '@fenix-engine/core';
import { pathFollowerBehaviour } from './pathFollowerBehaviour';
import { towerBehaviour } from './towerBehaviour';

export const registerBehaviours = (game: Game) => {
  game.behaviours.register('pathFollower', pathFollowerBehaviour(game));
  game.behaviours.register('tower', towerBehaviour);
  game.behaviours.register('orbit', (unit) => ({
    onUpdate: ({ deltaTime }) => unit.transform.rotateY(-6 * deltaTime),
  }));
};
