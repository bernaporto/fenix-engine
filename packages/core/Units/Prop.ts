import type { Object3D } from 'three';
import { applyMaterial } from './utils';
import { Material } from './Material';
import { Unit, UnitConfig } from './Unit';

export type PropConfig = UnitConfig & {
  assetPromise: Promise<Object3D>;
  material?: Material;
};

/**
 * A Prop is an inanimate object with a mesh child node.
 */
export class Prop extends Unit {
  constructor({ assetPromise, material, ...unitConfig }: PropConfig) {
    super(unitConfig);

    assetPromise.then((obj) => {
      this.node.add(obj);

      material && applyMaterial(obj, material.build());

      this.emit('load');
    });
  }
}
