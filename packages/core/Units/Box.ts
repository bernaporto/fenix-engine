import { BoxGeometry, Mesh } from 'three';
import type { MeshUnitConfig } from '../@types';
import { UnitRegistry } from '../Game/registries/UnitRegistry';
import type { Vector3 } from '../Math';
import { Unit } from './Unit';
import { applyMeshConfig } from './utils';

type BoxConfig = MeshUnitConfig & {
  width?: number;
  height?: number;
  depth?: number;
  segments?: Vector3;
};

class Box extends Unit {
  constructor(config?: BoxConfig) {
    super(config);

    const { width, height, depth, segments, ...meshUnitConfig } = {
      width: 1,
      height: 1,
      depth: 1,
      type: 'box',
      segments: { x: 1, y: 1, z: 1 },
      ...config,
    };

    const geometry = new BoxGeometry(
      width,
      height,
      depth,
      segments.x,
      segments.y,
      segments.z,
    );
    const mesh = new Mesh(geometry);

    applyMeshConfig(mesh, meshUnitConfig);

    this.node.add(mesh);
  }
}

UnitRegistry.add('box', Box);
export { Box };
