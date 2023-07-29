import { BehaviourType } from '@/constants';
import { game } from '@fenix-engine/core';
import { towerController } from './towerController';

export const registerTowerBehaviours = () => {
  const register = game.behaviours.register;
  register(BehaviourType.TowerController, towerController);
};
