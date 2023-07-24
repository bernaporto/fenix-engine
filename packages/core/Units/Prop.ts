import type { Object3D } from 'three';
import type { UnitConfigWithMaterial } from '../types';
import { applyMaterial } from './utils';
import { Unit } from './Unit';

export type PropConfig = UnitConfigWithMaterial & {
  assetPromise: Promise<Object3D>;
};

/**
 * A Prop is an inanimate object with a mesh child node.
 */
export class Prop extends Unit {
  constructor({ assetPromise, material, ...unitConfig }: PropConfig) {
    super(unitConfig);

    assetPromise.then((obj) => {
      this.node.add(obj);

      material && applyMaterial(obj, material);

      this.emit('load');
    });
  }
}
