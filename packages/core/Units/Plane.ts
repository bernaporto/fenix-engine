import { PlaneGeometry, Mesh } from 'three';
import type { MeshUnitConfig } from '../types';
import { Unit } from './Unit';
import { applyMeshConfig } from './utils';

type PlaneConfig = MeshUnitConfig & {
  width?: number;
  height?: number;
};

export class Plane extends Unit {
  constructor(config?: PlaneConfig) {
    super(config);

    const { width, height, ...meshUnitConfig } = {
      width: 1,
      height: 1,
      ...config,
    };

    const geometry = new PlaneGeometry(width, height);
    const mesh = new Mesh(geometry);

    applyMeshConfig(mesh, meshUnitConfig);

    this.node.add(mesh);
  }
}
