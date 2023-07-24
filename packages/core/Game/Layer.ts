import { Scene as THREE_Scene } from 'three';
import { Unit } from '../Units';

export class Layer extends Unit {
  public override readonly node: THREE_Scene;

  constructor(layerId: number) {
    super({ name: `layer-${layerId}` });

    this.node = new THREE_Scene();
  }

  public set background(color: THREE.Color) {
    this.node.background = color;
  }
}
