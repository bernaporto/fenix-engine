import { BehaviourType } from '@/constants';
import { game } from '@fenix-engine/core';
import { pathFollower } from './pathFollower';
import { puppeteer } from './puppeteer';
import { lifecycleManager } from './lifecycleManager';

export const registerEnemyBehaviours = () => {
  const register = game.behaviours.register;

  register(BehaviourType.EnemyLifecycleManager, lifecycleManager);
  register(BehaviourType.EnemyPuppeteer, puppeteer);
  register(BehaviourType.PathFollower, pathFollower);
};
