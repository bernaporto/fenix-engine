import { game } from '@fenix-engine/core';
import { Scene } from '@fenix-engine/core/Scene';
import { Vector2, type Vector3 } from '@fenix-engine/core/Math';
import { BehaviourType, Constants } from '@/constants';
import { store } from '@/store';
import { getProperty } from '../helpers';

export const loadLevel = (key: string): void => {
  game.stage.load(key).then(setupLevel);
};

const setupLevel = (scene: Scene) => {
  const initialCoins = getProperty(scene, 'initialCoins', 0);
  const defensePoints = getProperty(scene, 'defense', 10);
  const levelPath = getProperty<Vector3[]>(scene, 'path');
  const levelSize = getProperty<Vector2>(scene, 'size');

  store.set('level', {
    ...store.get('level'),
    path: levelPath,
    totalDefense: defensePoints,
    boundaries: {
      min: Constants.LEVEL_PADDING,
      max: Vector2.subtract(levelSize, Constants.LEVEL_PADDING),
    },
  });
  store.set('gameplay.stats', {
    ...store.get('gameplay.stats'),
    coins: initialCoins,
    defense: defensePoints,
    currentWave: 0,
    waveStatus: 'idle',
  });

  if (!scene.camera) {
    throw new Error('Scene must have a camera');
  }

  scene.camera.addBehaviour(BehaviourType.Draggable);
  scene.camera.addBehaviour(BehaviourType.Zoomable);

  store.set('loopState', 'onGame');
};
