import { SphereGeometry, Mesh } from 'three';
import type { MeshUnitConfig } from '../@types';
import { UnitRegistry } from '../Game/registries';
import type { Vector2 } from '../Math';
import { Unit } from './Unit';
import { applyMeshConfig } from './utils';

type SphereConfig = MeshUnitConfig & {
  radius?: number;
  segments?: Vector2;
};

class Sphere extends Unit {
  constructor(config?: SphereConfig) {
    super(config);

    const { radius, segments, ...meshUnitConfig } = {
      radius: 1,
      segments: {
        x: 32,
        y: 16,
      },
      ...config,
    };

    const geometry = new SphereGeometry(radius, segments.x, segments.y);
    const mesh = new Mesh(geometry);

    applyMeshConfig(mesh, meshUnitConfig);

    this.node.add(mesh);
  }
}

UnitRegistry.add('sphere', Sphere);
export { Sphere };
