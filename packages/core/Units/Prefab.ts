import type { PrefabConfig } from '../@types';
import { PrefabAssetRegistry } from '../Game/registries';
import { buildHierarchy } from '../utils';
import { Unit } from './Unit';

export class Prefab extends Unit {
  constructor({ path, ...unitConfig }: PrefabConfig) {
    super(unitConfig);

    const prefabPromise =
      PrefabAssetRegistry.get(path) ??
      PrefabAssetRegistry.add(path, { path, ...unitConfig });

    prefabPromise.then((prefab) => {
      buildHierarchy(prefab, () => this);

      this.applyConfig(prefab);
      this._emitEvent('load');
    });
  }
}
