import { BoxGeometry, Mesh } from 'three';
import type { UnitConfigWithMaterial } from '../types';
import { Unit } from './Unit';
import { applyMaterial } from './utils';

type BoxConfig = UnitConfigWithMaterial & {
  width?: number;
  height?: number;
  depth?: number;
};

export class Box extends Unit {
  constructor(config?: BoxConfig) {
    super(config);

    const { material, width = 1, height = 1, depth = 1 } = config || {};

    const geometry = new BoxGeometry(width, height, depth);
    const cube = new Mesh(geometry);
    material && applyMaterial(cube, material);

    this.node.add(cube);
  }
}
