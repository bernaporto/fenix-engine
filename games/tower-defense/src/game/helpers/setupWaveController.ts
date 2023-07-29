import { Unit } from '@fenix-engine/core/Units';
import type { Vector2 } from '@fenix-engine/core/Math';
import { Timer } from '@fenix-engine/services/Time';
import type { EnemyData, EnemyGroup, EnemyPack, WaveData } from '@/types';
import { store } from '@/store';
import { TDConstants } from '@/constants';
import { getGenerator, iterateOnList } from '../utils/iterate';
import { handleEnemyLifecycle } from './lifecycle';
import { Enemy } from '../units/Enemy';

const timer = new Timer();

export const setupWaveController = (waves: WaveData, root: Unit) => {
  const waveController = createWaveController(
    waves,
    root,
    store.get('level.path')
  );
  console.log('wave controller created');

  store.set('gameplay.stats.waveStatus', 'idle');
  console.log(store);

  const unsubscribe = store.subscribe(
    'gameplay.stats.waveStatus',
    (status) => {
      console.log('wave started');
      if (status !== 'running') return;

      waveController.next();
    },
    false
  );

  root.events.on('dispose', () => {
    console.log('wave controller disposed');
    timer.clear();
    unsubscribe();
  });
};

const createWaveController = (
  waves: WaveData,
  root: Unit,
  path: Vector2[]
): {
  next: VoidFunction;
} => {
  const wavesGen = getGenerator(waves);
  const enemies = new Set<Enemy>();
  const removeEnemy = (enemy: Enemy) => {
    enemies.delete(enemy);
    if (enemies.size === 0) {
      store.set(
        'gameplay.stats.waveStatus',
        nextWave.done ? 'finished' : 'idle'
      );
    }
  };

  const handleEnemyPacks = (packs: EnemyPack[], onceDone: VoidFunction): void =>
    iterateOnList({
      onceDone,
      list: packs,
      handleItem: (pack, nextPack) => {
        handleEnemyGroups(pack.enemies, () => {
          timer.setTimer(nextPack, TDConstants.INTERVAL_ENEMY_PACK);
        });
      },
    });

  const handleEnemyGroups = (
    enemies: EnemyGroup[],
    onceDone: VoidFunction
  ): void =>
    iterateOnList({
      onceDone,
      list: enemies,
      handleItem: (enemyGroup, nextGroup) => {
        handleEnemyGroup(enemyGroup, () => {
          timer.setTimer(nextGroup, TDConstants.INTERVAL_ENEMY_GROUP);
        });
      },
    });

  const handleEnemyGroup = (
    enemyGroup: EnemyGroup,
    onceDone: VoidFunction
  ): void => {
    const { count, type } = enemyGroup;
    // const enemyData = getEnemyData(type);

    // if (!enemyData) {
    //   throw new Error(`Enemy data for type ${type} not found`);
    // }

    const list = new Array<EnemyData>(count).fill({} as any);

    iterateOnList({
      onceDone,
      list,
      handleItem: (data, nextEnemy) => {
        const enemy = new Enemy(type);

        root.append(enemy);
        handleEnemyLifecycle(enemy);

        timer.setTimer(nextEnemy, TDConstants.INTERVAL_ENEMY_SPAWN);
      },
    });
  };

  let nextWave = wavesGen.next();

  return {
    next: () => {
      const { value } = nextWave;
      if (!value) return;

      nextWave = wavesGen.next();

      // update store
      const current = store.get('gameplay.stats.currentWave');
      store.set('gameplay.stats.currentWave', current + 1);

      const { packs } = value;

      handleEnemyPacks(packs, () => {
        root.children.forEach((child) => {
          if (child instanceof Enemy) {
            enemies.add(child);
            child.events.on('dispose', () => removeEnemy(child));
          }
        });
      });
    },
  };
};

const getEnemyData = (type: string): EnemyData | null =>
  store.get('gameplay.config.enemies')[type] ?? null;
