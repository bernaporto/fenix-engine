import EventEmitter from 'eventemitter3';
import { Object3D } from 'three';
import { v4 as uuid4 } from 'uuid';
import {
  BehaviourController,
  BehaviourRegistry,
} from '../Game/registries/BehaviourRegistry';
import { Vector3 } from '../Math';
import type { TickerState } from '../Tools/Ticker';
import { UnitConfig } from '../types';

type UnitEventCallbackMap = {
  dispose: VoidFunction;
  load: VoidFunction;
  update: (state: TickerState) => void;
};
export type UnitEvent = keyof UnitEventCallbackMap;

/**
 * A Unit represents any kind of element that can be placed in the scene.
 * Units can receive Behaviour scripts, which are defined by the developer.
 */
export class Unit {
  public readonly id: string;
  public readonly name: string;
  public readonly node = new Object3D();
  public readonly transform = makeTransformController(this);

  private _children = new Set<Unit>();
  private _emitter = new EventEmitter();
  private _parent: Unit | null = null;
  private _behaviours = new Map<string, BehaviourController>();

  constructor(config?: UnitConfig) {
    const id = uuid4();
    const { name = `Unit-${id}` } = config || {};

    this.id = id;
    this.name = name;
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
  public addBehaviour(key: string) {
    const behaviour = BehaviourRegistry.get(key);

    if (!behaviour) {
      throw new Error(`Behaviour not found for key: ${key}`);
    }

    const controller = behaviour(this);
    this._behaviours.set(key, controller);
  }

  public removeBehaviour(key: string) {
    const controller = this._behaviours.get(key);

    if (controller) {
      controller.dispose();
      this._behaviours.delete(key);
    }
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

  public update(state: TickerState) {
    this.emit('update', state);

    this.children.forEach((child) => child.update(state));
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
