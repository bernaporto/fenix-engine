import { store } from '@/store';
import { Ticker } from '@fenix-engine/core/Tools/Ticker';

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

    store.subscribe('loopState', (state) => {
      const currStatus = Ticker.state.get().status;

      const pauseStates = ['paused', 'gameOver', 'gameWin'];

      if (pauseStates.includes(state) && currStatus === 'running') {
        Ticker.setStatus('paused');
      } else if (currStatus === 'paused') {
        Ticker.setStatus('running');
      }
    }),
  ];

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
  };
};
