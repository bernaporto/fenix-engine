import { BoxGeometry, type Material, Mesh } from 'three';
import { Unit, type UnitConfig } from './Unit';

type BoxConfig = UnitConfig & {
  width?: number;
  height?: number;
  depth?: number;
  material?: Material;
};

export class Box extends Unit {
  constructor({
    material,
    width = 1,
    height = 1,
    depth = 1,
    ...unitConfig
  }: BoxConfig) {
    super(unitConfig);

    const geometry = new BoxGeometry(width, height, depth);
    const cube = new Mesh(geometry, material);

    this.node.add(cube);
  }
}
