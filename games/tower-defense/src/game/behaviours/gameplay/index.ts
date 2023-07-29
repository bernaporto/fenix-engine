import { game } from '@fenix-engine/core';
import type { MouseHandler } from '@fenix-engine/services/Input';
import { BehaviourType } from '@/constants';
import { interactable } from './interactable';
import { waveController } from './waveController';

export const registerGameplayBehaviours = (mouse: MouseHandler) => {
  const register = game.behaviours.register;

  register(BehaviourType.Interactable, interactable(mouse));
  register(BehaviourType.WaveController, waveController);
};
