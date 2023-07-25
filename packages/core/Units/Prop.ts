import type { Object3D } from 'three';
import { PropAssetRegistry } from '../Game/registries';
import type { AssetUnitConfig } from '../types';
import { applyMeshConfig } from './utils';
import { Unit } from './Unit';

/**
 * A Prop is an inanimate object with a mesh child node.
 */
export class Prop extends Unit {
  constructor({ path, ...unitConfig }: AssetUnitConfig) {
    super(unitConfig);

    const assetPromise =
      PropAssetRegistry.get(path) ?? PropAssetRegistry.add(path, path);

    assetPromise.then(cloneObject).then((obj) => {
      this.node.add(obj);

      applyMeshConfig(obj, unitConfig);

      this._emitEvent('load');
    });
  }
}

const cloneObject = (obj: Object3D): Object3D => obj.clone();
