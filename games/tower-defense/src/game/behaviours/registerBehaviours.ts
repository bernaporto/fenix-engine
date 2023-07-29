import type { MouseHandler } from '@fenix-engine/services/Input/MouseHandler';
import { registerCameraBehaviours } from './camera';
import { registerEnemyBehaviours } from './enemy';
import { registerGameplayBehaviours } from './gameplay';
import { registerTowerBehaviours } from './tower';

export const registerBehaviours = (mouse: MouseHandler) => {
  registerCameraBehaviours(mouse);
  registerEnemyBehaviours();
  registerGameplayBehaviours();
  registerTowerBehaviours();
};
