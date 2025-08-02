import { PlaneGeometry, Mesh } from 'three';
import type { MeshUnitConfig } from '../@types';
import { UnitRegistry } from '../Game/registries/UnitRegistry';
import type { Vector2 } from '../Math';
import { Unit } from './Unit';
import { applyMeshConfig } from './utils';

type PlaneConfig = MeshUnitConfig & {
  width?: number;
  height?: number;
  segments?: Vector2;
};

class Plane extends Unit {
  constructor(config?: PlaneConfig) {
    super(config);

    const { width, height, segments, ...meshUnitConfig } = {
      height: 1,
      segments: { x: 1, y: 1 },
      type: 'plane',
      width: 1,
      ...config,
    };

    const geometry = new PlaneGeometry(width, height, segments.x, segments.y);
    const mesh = new Mesh(geometry);

    applyMeshConfig(mesh, meshUnitConfig);

    this.node.add(mesh);
  }
}

UnitRegistry.add('plane', Plane);
export { Plane };
