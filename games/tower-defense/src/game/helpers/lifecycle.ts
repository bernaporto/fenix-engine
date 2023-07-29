import { positive } from '@fenix-engine/utilities/misc';
import { store } from '@/store';
import { Enemy } from '../units/Enemy';
import { getProperty } from './getProperty';

export const handleEnemyLifecycle = (enemy: Enemy) => {
  enemy.events.on('dispose', () => {
    const isDead = getProperty<number>(enemy, 'health') <= 0;

    // you win coins
    if (isDead) {
      const currCoins = store.get('gameplay.stats.coins');
      const reward = getProperty<number>(enemy, 'reward');

      store.set('gameplay.stats.coins', currCoins + reward);

      return;
    }

    // you lose health
    const currHealth = store.get('gameplay.stats.health');

    store.set(
      'gameplay.stats.health',
      positive(currHealth - getProperty<number>(enemy, 'damage'))
    );
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
        const totalWaves = store.get('level.waves').length;

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
