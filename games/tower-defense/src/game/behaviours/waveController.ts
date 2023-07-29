import { Behaviour } from '@fenix-engine/core/@types';
import { Timer } from '@fenix-engine/services/Time';
import { Unit } from '@fenix-engine/core/Units';
import { EnemyGroup, EnemyPack, WaveData } from '@/types';
import { store } from '@/store';
import { Constants } from '@/constants';
import { Enemy } from '../units/Enemy';
import { getGenerator, iterateOnList } from '../utils/iterate';
import { getProperty } from '../helpers';
import { handleEnemyLifecycle } from '../helpers/lifecycle';

const timer = new Timer();

export const waveController: Behaviour = (unit) => {
  const waves = getProperty<WaveData>(unit, 'waves');
  const waveController = createWaveController(waves, unit, timer);

  store.set('level.totalWaves', waves.length);
  store.set('gameplay.stats.waveStatus', 'idle');

  const unsubscribe = store.subscribe(
    'gameplay.stats.waveStatus',
    (status) => {
      if (status !== 'running') return;

      waveController.next();
    },
    false
  );

  return {
    onDetach: () => {
      timer.clear();
      unsubscribe();
    },
  };
};

export const createWaveController = (
  waves: WaveData,
  root: Unit,
  timer: Timer
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
          timer.setTimer(nextPack, Constants.INTERVAL_ENEMY_PACK);
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
          timer.setTimer(nextGroup, Constants.INTERVAL_ENEMY_GROUP);
        });
      },
    });

  const handleEnemyGroup = (
    enemyGroup: EnemyGroup,
    onceDone: VoidFunction
  ): void => {
    const { count, type } = enemyGroup;
    const list = new Array(count).fill(true);

    iterateOnList({
      onceDone,
      list,
      handleItem: (_, nextEnemy) => {
        const enemy = new Enemy(type);

        root.append(enemy);
        handleEnemyLifecycle(enemy);

        timer.setTimer(nextEnemy, Constants.INTERVAL_ENEMY_SPAWN);
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
