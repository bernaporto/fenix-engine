import { Behaviour } from '@fenix-engine/core/@types';
import { Prefab, Unit } from '@fenix-engine/core/Units';
import { Vector3 } from '@fenix-engine/core/Math';
import { store } from '@/store';

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

      let prefabPath = 'assets/props/towers/empty_slot.prefab';
      let properties = {};

      if (towerType !== 'empty') {
        const config = store.get(`config.towers.${towerType}`);

        if (!config) {
          throw new Error(`Could not find config for tower ${towerType}`);
        }
        if (!config.prefab) {
          throw new Error(`Prefab is not configured for ${towerType}`);
        }

        const { prefab, ...rest } = config;
        prefabPath = prefab;
        properties = rest;
      }

      currentTower = new Prefab({ properties, path: prefabPath });
      adjustPosition(currentTower);
      unit.append(currentTower);
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
