import { Color, Scene as THREE_Scene } from 'three';
import { SceneItem } from './SceneItem';
import type { QueryEnabled } from '../@types';
import { makeQueryHandler } from '../utils';

export class Layer extends SceneItem implements QueryEnabled {
  public override readonly node: THREE_Scene;
  public readonly query = makeQueryHandler(this);

  constructor() {
    super();

    this.node = new THREE_Scene();
  }

  public set background(color: Color | null) {
    this.node.background = color;
  }

  public clear(): void {
    this.node.children.length = 0;
  }
}
