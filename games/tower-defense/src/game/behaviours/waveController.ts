import { Behaviour } from '@fenix-engine/core/@types';
import { getProperty, setupWaveController } from '../helpers';
import { WaveData } from '@/types';

export const waveController: Behaviour = (unit) => {
  const waves = getProperty<WaveData>(unit, 'waves');

  setupWaveController(waves, unit);

  return {};
};
