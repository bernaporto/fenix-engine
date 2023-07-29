import { game } from '@fenix-engine/core';
import { animated } from './animated';
import { pathFollower } from './pathFollower';
import { towerBehaviour } from './towerBehaviour';
import { waveController } from './waveController';

export const registerBehaviours = () => {
  const register = game.behaviours.register;

  register('animated', animated);
  register('waveController', waveController);
  register('pathFollower', pathFollower);
  register('tower', towerBehaviour);
  register('orbit', (unit) => ({
    onUpdate: ({ deltaTime }) => unit.transform.rotateY(-6 * deltaTime),
  }));
};
