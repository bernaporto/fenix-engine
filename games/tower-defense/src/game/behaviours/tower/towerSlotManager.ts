import { Behaviour } from '@fenix-engine/core/@types';
import { Prefab, Unit } from '@fenix-engine/core/Units';
import { Vector3 } from '@fenix-engine/core/Math';
import { store } from '@/store';
import { TowerType } from '@/types';

const towerAssets = {
  empty: 'assets/props/towers/empty_slot.prefab',
  watch: 'assets/props/towers/watch/watch_1.prefab',
} as Record<TowerType, string>;

export const towerSlotManager: Behaviour = (unit) => {
  const slotKey = Vector3.toString(unit.transform.position);

  store.set(`gameplay.towerSlots.${slotKey}`, 'empty');
  let currentTower: Prefab | null = null;

  const unsubscribe = store.subscribe(
    `gameplay.towerSlots.${slotKey}`,
    (towerType) => {
      if (currentTower) {
        currentTower.dispose();
        currentTower = null;
      }

      const assetPath = towerAssets[towerType];
      if (assetPath) {
        currentTower = new Prefab({ path: assetPath });
        adjustPosition(currentTower);
        unit.append(currentTower);
      }
    }
  );

  return {
    onDetach: unsubscribe,
  };
};

// TODO: This should be done in the model
const adjustPosition = (unit: Unit) => {
  unit.transform.setPosition(
    Vector3.add(unit.transform.position, {
      x: 0,
      y: -0.03,
      z: 0,
    })
  );
};
