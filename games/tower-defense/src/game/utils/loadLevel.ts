import { game } from '@fenix-engine/core';
import { Scene } from '@fenix-engine/core/Scene';
import { Vector3 } from '@fenix-engine/core/Math';
import { store } from '@/store';
import { getProperty } from '../helpers';

export const loadLevel = (key: string): void => {
  game.stage.load(key).then(setupLevel);
};

const setupLevel = (scene: Scene) => {
  const initialCoins = getProperty(scene, 'initialCoins', 0);
  const defensePoints = getProperty(scene, 'defense', 10);
  const levelPath = getProperty<Vector3[]>(scene, 'path');

  store.set('level', {
    ...store.get('level'),
    path: levelPath,
    totalDefense: defensePoints,
  });
  store.set('gameplay.stats', {
    ...store.get('gameplay.stats'),
    coins: initialCoins,
    defense: defensePoints,
    currentWave: 0,
    waveStatus: 'idle',
  });

  store.set('loopState', 'onGame');
};
