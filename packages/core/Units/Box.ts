import { BoxGeometry, Mesh } from 'three';
import type { MeshUnitConfig } from '../types';
import { Unit } from './Unit';
import { applyMaterial } from './utils';

type BoxConfig = MeshUnitConfig & {
  width?: number;
  height?: number;
  depth?: number;
};

export class Box extends Unit {
  constructor(config?: BoxConfig) {
    super(config);

    const {
      material,
      width = 1,
      height = 1,
      depth = 1,
      castShadow,
      receiveShadow,
    } = config || {};

    const geometry = new BoxGeometry(width, height, depth);
    const mesh = new Mesh(geometry);

    mesh.castShadow = castShadow ?? false;
    mesh.receiveShadow = receiveShadow ?? false;

    material && applyMaterial(mesh, material);

    this.node.add(mesh);
  }
}
