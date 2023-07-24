import type { Object3D } from 'three';
import { PropAssetRegistry } from '../Game/registries';
import type { AssetUnitConfig } from '../types';
import { applyMaterial } from './utils';
import { Unit } from './Unit';

/**
 * A Prop is an inanimate object with a mesh child node.
 */
export class Prop extends Unit {
  constructor({ path, material, ...unitConfig }: AssetUnitConfig) {
    super(unitConfig);

    const assetPromise =
      PropAssetRegistry.get(path) ?? PropAssetRegistry.add(path, path);

    assetPromise.then(cloneObject).then((obj) => {
      this.node.add(obj);

      material && applyMaterial(obj, material);

      this.emit('load');
    });
  }
}

const cloneObject = (obj: Object3D): Object3D => obj.clone();
