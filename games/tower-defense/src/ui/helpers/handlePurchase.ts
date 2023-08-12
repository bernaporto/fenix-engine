import { store } from '@/store';
import type { TowerData } from '@/types';

export const handlePurchase = (tower: TowerData) => {
  const cost = tower.stats.cost;
  const currentCoins = store.get('gameplay.stats.coins');
  const currSelected = store.get('gameplay.selected');

  if (currentCoins < cost) return;

  store.set('gameplay.stats.coins', currentCoins - cost);
  store.set('gameplay.selected', null);

  if (currSelected) {
    store.set(`gameplay.towerSlots.${currSelected.key}`, tower.type);
  }
};
