import { PlaneGeometry, Mesh } from 'three';
import type { MeshUnitConfig } from '../types';
import { Unit } from './Unit';
import { applyMaterial } from './utils';

type PlaneConfig = MeshUnitConfig & {
  width?: number;
  height?: number;
};

export class Plane extends Unit {
  constructor(config?: PlaneConfig) {
    super(config);

    const {
      material,
      width = 1,
      height = 1,
      castShadow,
      receiveShadow,
    } = config ?? {};

    const geometry = new PlaneGeometry(width, height);
    const mesh = new Mesh(geometry);

    mesh.castShadow = castShadow ?? false;
    mesh.receiveShadow = receiveShadow ?? false;

    material && applyMaterial(mesh, material);

    this.node.add(mesh);
  }
}
