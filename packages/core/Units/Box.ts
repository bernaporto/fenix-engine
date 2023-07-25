import { BoxGeometry, Mesh } from 'three';
import type { MeshUnitConfig } from '../types';
import { Unit } from './Unit';
import { applyMeshConfig } from './utils';

type BoxConfig = MeshUnitConfig & {
  width?: number;
  height?: number;
  depth?: number;
};

export class Box extends Unit {
  constructor(config?: BoxConfig) {
    super(config);

    const { width, height, depth, ...meshUnitConfig } = {
      width: 1,
      height: 1,
      depth: 1,
      ...config,
    };

    const geometry = new BoxGeometry(width, height, depth);
    const mesh = new Mesh(geometry);

    applyMeshConfig(mesh, meshUnitConfig);

    this.node.add(mesh);
  }
}
