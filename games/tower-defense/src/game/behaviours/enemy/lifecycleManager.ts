import { getProperty } from '@/game/helpers';
import { store } from '@/store';
import { EnemyData } from '@/types';
import { Behaviour } from '@fenix-engine/core/@types';
import { positive } from '@fenix-engine/utilities/misc';

export const lifecycleManager: Behaviour = (unit) => {
  unit.events.on('dispose', () => {
    const { damage, health, reward } = getProperty<EnemyData['stats']>(
      unit,
      'stats'
    );

    // you win coins
    if (health <= 0) {
      const currCoins = store.get('gameplay.stats.coins');
      store.set('gameplay.stats.coins', currCoins + reward);

      return;
    }

    // you lose points
    const currDefPoints = store.get('gameplay.stats.defense');
    store.set('gameplay.stats.defense', positive(currDefPoints - damage));
  });
};
