import { Mesh, Object3D } from 'three';
import type { LifecycleEnabled } from '../@types';
import { TickerState } from '../Tools/Ticker';

const sceneItems = new WeakMap<Object3D, SceneItem>();

export class SceneItem implements LifecycleEnabled {
  public readonly node: Object3D;

  constructor(public readonly id: string = crypto.randomUUID()) {
    this.node = new Object3D();
    this.registerNode(this.node);
  }

  /* Graph */
  public get children(): SceneItem[] {
    return this.node.children.flatMap((node) => {
      const item = sceneItems.get(node);
      return item ? [item] : [];
    });
  }

  public get parent(): SceneItem | null {
    return (this.node.parent && sceneItems.get(this.node.parent)) ?? null;
  }

  public append(...items: SceneItem[]): void {
    items.forEach((item) => {
      item.setParent(this);
    });
  }

  public remove(...items: SceneItem[]): void {
    items.forEach((item) => {
      if (item.node.parent === this.node) {
        item.removeFromParent();
      }
    });
  }

  public setParent(parent: SceneItem): void {
    parent.node.add(this.node);
  }

  public removeFromParent(): void {
    this.node.removeFromParent();
  }

  /* Lifecycle */
  public dispose(): void {
    this.removeFromParent();

    this.children.forEach((child) => child.dispose());

    this.node.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry?.dispose();
        child.material?.dispose();
      }
    });

    this.node.clear();
  }

  public update(state: TickerState): void {
    this.children.forEach((child) => child.update(state));
  }

  protected registerNode(node: Object3D): void {
    sceneItems.set(node, this);
  }
}
