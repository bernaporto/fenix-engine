import { Mesh, Object3D } from 'three';
import { v4 as uuid4 } from 'uuid';
import type { LifecycleEnabled } from '../@types';
import { TickerState } from '../Tools/Ticker';

export class SceneItem implements LifecycleEnabled {
  public readonly id: string;
  public readonly node: Object3D;

  private _children = new Set<SceneItem>();
  private _parent: SceneItem | null = null;

  constructor() {
    this.id = uuid4();
    this.node = new Object3D();
  }

  /* Graph */
  public get children(): SceneItem[] {
    return Array.from(this._children);
  }

  public get parent(): SceneItem | null {
    return this._parent;
  }

  public append(...items: SceneItem[]): void {
    items.forEach((item) => {
      this._children.add(item);
      item.setParent(this);
    });
  }

  public remove(...items: SceneItem[]): void {
    items.forEach((item) => {
      const success = this._children.delete(item);
      success && item.removeFromParent();
    });
  }

  public setParent(parent: SceneItem): void {
    this.removeFromParent();

    this._parent = parent;
    parent.node.add(this.node);
  }

  public removeFromParent(): void {
    if (this._parent) {
      this._parent.remove(this);
    }

    this._parent = null;
  }

  /* Lifecycle */
  public dispose(): void {
    this.removeFromParent();

    this._children.forEach((child) => {
      child.dispose();
    });
    this._children.clear();

    this.node.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry?.dispose();
        child.material?.dispose();
      }
    });

    this.node.clear();
  }

  public update(state: TickerState): void {
    this._children.forEach((child) => {
      child.update(state);
    });
  }
}
