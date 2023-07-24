import { BoxGeometry, Mesh } from 'three';
import { Material } from './Material';
import { Unit, type UnitConfig } from './Unit';

type BoxConfig = UnitConfig & {
  width?: number;
  height?: number;
  depth?: number;
  material?: Material;
};

export class Box extends Unit {
  constructor(config?: BoxConfig) {
    super(config);

    const { material, width = 1, height = 1, depth = 1 } = config || {};

    const geometry = new BoxGeometry(width, height, depth);
    const cube = new Mesh(geometry, material?.build());

    this.node.add(cube);
  }
}
