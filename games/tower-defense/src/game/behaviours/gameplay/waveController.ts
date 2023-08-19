import { Behaviour } from '@fenix-engine/core/@types';
import { Timer } from '@fenix-engine/services/Time';
import { Prefab, Unit } from '@fenix-engine/core/Units';
import { EnemyData, EnemyGroup, EnemyPack, WaveData } from '@/types';
import { store } from '@/store';
import { Constants } from '@/constants';
import { getGenerator, iterateOnList } from '@/game/utils/iterate';
import { getProperty } from '@/game/helpers';

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
  const enemies = new Set<Unit>();
  const removeEnemy = (enemy: Unit) => {
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
    const enemyData = getEnemyData(type);

    if (!enemyData) {
      throw new Error(`Enemy data for type ${type} not found`);
    }

    const { prefab, ...properties } = enemyData;

    if (!prefab) {
      throw new Error(`Prefab not configured for enemy ${type}`);
    }

    const list = new Array(count).fill(true);

    iterateOnList({
      onceDone,
      list,
      handleItem: (_, nextEnemy) => {
        const enemy = new Prefab({
          properties,
          path: prefab,
        });

        root.append(enemy);

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
          if (child instanceof Prefab) {
            enemies.add(child);
            child.events.on('dispose', () => removeEnemy(child));
          }
        });
      });
    },
  };
};

const getEnemyData = (type: string): EnemyData | null =>
  store.get(`config.enemies.${type}`) ?? null;
