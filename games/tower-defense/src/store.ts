import { createStore } from '@fenix-engine/utilities/store';
import { Vector2 } from '@fenix-engine/core/Math';
import type { GameState } from './types';
import { TDConstants } from './constants';

export const store = createStore<GameState>({
  loopState: 'preLoad',

  camera: {
    boundaries: {
      min: Vector2.zero,
      max: Vector2.zero,
    },
    position: Vector2.zero,
    zoom: 3,
  },

  debug: {
    towers: import.meta.env.DEV,
  },

  level: {
    path: [],
    totalHealth: TDConstants.LEVEL_HEALTH,
    totalWaves: 0,
  },

  gameplay: {
    config: {
      enemies: {},
      towers: {},
    },
    stats: {
      coins: TDConstants.INITIAL_COINS,
      currentWave: 0,
      health: TDConstants.LEVEL_HEALTH,
      waveStatus: 'idle',
    },
    selected: null,
    towerSlots: {},
  },
});

if (import.meta.env.DEV) {
  // @ts-ignore
  window.store = store;
  store._setDebugMode(true);
}
