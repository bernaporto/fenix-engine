import { BehaviourType } from '@/constants';
import { game } from '@fenix-engine/core';
import { waveController } from './waveController';

export const registerGameplayBehaviours = () => {
  const register = game.behaviours.register;
  register(BehaviourType.WaveController, waveController);
};
