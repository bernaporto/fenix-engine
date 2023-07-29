import { game } from '@fenix-engine/core';
import type { MouseHandler } from '@fenix-engine/services/Input/MouseHandler';
import { BehaviourType } from '@/constants';
import { enemyPuppeteer } from './enemy/enemyPuppeteer';
import { pathFollower } from './enemy/pathFollower';
import { towerController } from './tower/towerController';
import { waveController } from './waveController';
import { draggable } from './camera/draggable';
import { zoomable } from './camera/zoomable';

export const registerBehaviours = (mouse: MouseHandler) => {
  const register = game.behaviours.register;

  register(BehaviourType.Draggable, draggable(mouse));
  register(BehaviourType.Zoomable, zoomable(mouse));
  register(BehaviourType.EnemyPuppeteer, enemyPuppeteer);
  register(BehaviourType.PathFollower, pathFollower);
  register(BehaviourType.TowerController, towerController);
  register(BehaviourType.WaveController, waveController);
};
