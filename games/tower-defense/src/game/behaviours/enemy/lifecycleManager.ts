import { getProperty } from '@/game/helpers';
import { store } from '@/store';
import { Behaviour } from '@fenix-engine/core/@types';
import { positive } from '@fenix-engine/utilities/misc';

export const lifecycleManager: Behaviour = (unit) => {
  unit.events.on('dispose', () => {
    const health = getProperty<number>(unit, 'health');

    // you win coins
    if (health <= 0) {
      const currCoins = store.get('gameplay.stats.coins');
      const reward = getProperty<number>(unit, 'reward');
      store.set('gameplay.stats.coins', currCoins + reward);

      return;
    }

    // you lose points
    const currDefPoints = store.get('gameplay.stats.defense');
    const damage = getProperty<number>(unit, 'damage');
    store.set('gameplay.stats.defense', positive(currDefPoints - damage));
  });
};
