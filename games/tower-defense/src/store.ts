import { createStore } from '@fenix-engine/utilities/store';
import { Vector2 } from '@fenix-engine/core/Math';
import type { GameState } from './types';

export const store = createStore<GameState>({
  loopState: 'preLoad',

  debug: {
    towers: import.meta.env.DEV,
  },

  level: {
    boundaries: {
      min: Vector2.zero,
      max: Vector2.zero,
    },
    path: [],
    totalDefense: 0,
    totalWaves: 0,
  },

  gameplay: {
    stats: {
      coins: 0,
      currentWave: 0,
      defense: 0,
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
