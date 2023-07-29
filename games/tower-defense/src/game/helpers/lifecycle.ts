import { store } from '@/store';

export const hookGameLifecycleEvents = (): VoidFunction => {
  const subscriptions = [
    store.subscribe('gameplay.stats.defense', (defPoints) => {
      if (defPoints <= 0) {
        store.set('loopState', 'gameOver');
      }
    }),

    store.subscribe('gameplay.stats.waveStatus', (status) => {
      if (status === 'finished') {
        const currWave = store.get('gameplay.stats.currentWave');
        const totalWaves = store.get('level.totalWaves');

        if (currWave === totalWaves) {
          store.set('loopState', 'gameWin');
        }
      }
    }),
  ];

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
  };
};
