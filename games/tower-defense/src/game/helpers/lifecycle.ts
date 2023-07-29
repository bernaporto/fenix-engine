import { positive } from '@fenix-engine/utilities/misc';
import { store } from '@/store';
import { Enemy } from '../units/Enemy';
import { getProperty } from './getProperty';
import { EnemyData } from '@/types';

export const handleEnemyLifecycle = (enemy: Enemy) => {
  enemy.events.on('dispose', () => {
    const { damage, health, reward } = getProperty<EnemyData['stats']>(
      enemy,
      'stats'
    );
    const isDead = health <= 0;

    // you win coins
    if (isDead) {
      const currCoins = store.get('gameplay.stats.coins');
      store.set('gameplay.stats.coins', currCoins + reward);

      return;
    }

    // you lose health
    const currHealth = store.get('gameplay.stats.health');
    store.set('gameplay.stats.health', positive(currHealth - damage));
  });
};

export const handleGameLifecycle = (): VoidFunction => {
  const subscriptions = [
    store.subscribe('gameplay.stats.health', (health) => {
      if (health <= 0) {
        store.set('loopState', 'onGameOver');
      }
    }),

    store.subscribe('gameplay.stats.waveStatus', (status) => {
      if (status === 'finished') {
        const currWave = store.get('gameplay.stats.currentWave');
        const totalWaves = store.get('level.totalWaves');

        if (currWave === totalWaves) {
          store.set('loopState', 'onGameWin');
        }
      }
    }),
  ];

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
  };
};
