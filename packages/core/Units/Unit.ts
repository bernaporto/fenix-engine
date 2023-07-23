import { Object3D } from 'three';
import { v4 as uuid4 } from 'uuid';
import { Vector3 } from '../Math';
import EventEmitter from 'eventemitter3';

export type Behavior = (unit: Unit) => void;

type UnitEventCallbackMap = {
  dispose: VoidFunction;
  load: VoidFunction;
  update: (delta: number) => void;
};
export type UnitEvent = keyof UnitEventCallbackMap;
export type UnitConfig = {
  name?: string;
};

/**
 * A Unit represents any kind of element that can be placed in the scene.
 * Units can receive Behavior scripts, which are defined by the developer.
 */
export class Unit {
  public readonly behaviors = new Set<Behavior>();
  public readonly id: string;
  public readonly name: string;
  public readonly node = new Object3D();
  public readonly transform = makeTransformController(this);

  private _children = new Set<Unit>();
  private _emitter = new EventEmitter();
  private _parent: Unit | null = null;

  constructor({ name }: UnitConfig) {
    const id = uuid4();
    this.id = id;
    this.name = name || `Unit-${id}`;
  }

  /* Parenting */
  public get children() {
    return this._children;
  }

  public append(child: Unit) {
    child._parent = this;

    this._children.add(child);
    this.node.add(child.node);
  }

  public remove(child: Unit) {
    child.removeFromParent();
    child.node.removeFromParent();

    this._children.delete(child);
  }

  public setParent(parent: Unit) {
    this.removeFromParent();

    parent.append(this);
  }

  public removeFromParent() {
    if (this._parent) {
      this._parent.remove(this);
    }

    this._parent = null;
  }

  /* Behaviours */
  public addBehavior(behavior: Behavior) {
    this.behaviors.add(behavior);
  }

  public removeBehavior(behavior: Behavior) {
    this.behaviors.delete(behavior);
  }

  /* Events */
  protected _onEvent(
    event: string,
    callback: (...args: any[]) => void
  ): VoidFunction {
    this._emitter.on(event, callback);

    return () => {
      this._emitter.off(event, callback);
    };
  }

  protected emit(event: UnitEvent, ...args: any[]): void {
    this._emitter.emit(event, ...args);
  }

  public on<E extends UnitEvent>(
    event: E,
    callback: UnitEventCallbackMap[E]
  ): VoidFunction {
    return this._onEvent(event, callback);
  }

  /* Lifecycle */
  public dispose() {
    this.emit('dispose');
    this._emitter.removeAllListeners();

    this.removeFromParent();
  }

  public update(delta: number) {
    this.emit('update', delta);
  }
}

export type TransformController = {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  setPosition: (value: Vector3) => void;
  setRotation: (value: Vector3) => void;
  setScale: (value: Vector3) => void;
};

export const makeTransformController = (unit: Unit): TransformController => {
  let position = Vector3.create();
  let rotation = Vector3.create();
  let scale = Vector3.create();

  const node = unit.node;

  return {
    get position() {
      return Vector3.copy(position);
    },

    get rotation() {
      return Vector3.copy(rotation);
    },

    get scale() {
      return Vector3.copy(scale);
    },

    setPosition: (value: Vector3) => {
      position = Vector3.copy(value);

      node.position.set(position.x, position.y, position.z);
    },

    setRotation: (value: Vector3) => {
      rotation = Vector3.copy(value);

      node.rotation.set(rotation.x, rotation.y, rotation.z);
    },

    setScale: (value: Vector3) => {
      scale = Vector3.copy(value);

      node.scale.set(scale.x, scale.y, scale.z);
    },
  };
};
