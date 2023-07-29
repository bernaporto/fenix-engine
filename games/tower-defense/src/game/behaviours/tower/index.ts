import { BehaviourType } from '@/constants';
import { game } from '@fenix-engine/core';
import { towerController } from './towerController';
import { towerSlotManager } from './towerSlotManager';

export const registerTowerBehaviours = () => {
  const register = game.behaviours.register;
  register(BehaviourType.TowerController, towerController);
  register(BehaviourType.TowerSlotManager, towerSlotManager);
};
