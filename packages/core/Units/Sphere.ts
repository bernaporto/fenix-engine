import { SphereGeometry, Mesh } from 'three';
import type { MeshUnitConfig } from '../@types';
import type { Vector2 } from '../Math';
import { Unit } from './Unit';
import { applyMeshConfig } from './utils';

type SphereConfig = MeshUnitConfig & {
  radius?: number;
  subdivision?: Vector2;
};

export class Sphere extends Unit {
  constructor(config?: SphereConfig) {
    super(config);

    const { radius, subdivision, ...meshUnitConfig } = {
      radius: 1,
      subdivision: {
        x: 32,
        y: 16,
      },
      ...config,
    };

    const geometry = new SphereGeometry(radius, subdivision.x, subdivision.y);
    const mesh = new Mesh(geometry);

    applyMeshConfig(mesh, meshUnitConfig);

    this.node.add(mesh);
  }
}
