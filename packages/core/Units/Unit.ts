import EventEmitter from 'eventemitter3';
import { Object3D } from 'three';
import { v4 as uuid4 } from 'uuid';
import {
  BehaviourController,
  BehaviourRegistry,
} from '../Game/registries/BehaviourRegistry';
import {
  CustomEvent,
  EventHandler,
  Queryable,
  SceneUnit,
  UnitConfig,
} from '../types';
import type { TickerState } from '../Tools/Ticker';
import { Vector3 } from '../Math';
import { makeTransformController } from './utils';

type UnitEventCallbackMap = {
  dispose: VoidFunction;
  load: VoidFunction;
  update: (state: TickerState) => void;
} & Record<CustomEvent, (...args: any[]) => void>;

export type UnitEvent = keyof UnitEventCallbackMap;

/**
 * A Unit represents any kind of element that can be placed in the scene.
 * Units can receive Behaviour scripts, which are defined by the developer.
 */
export class Unit implements EventHandler, Queryable, SceneUnit {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public readonly node = new Object3D();
  public readonly properties: Record<string, any> = {};
  public readonly transform = makeTransformController(this);

  private _behaviours = new Map<string, BehaviourController>();
  private _children = new Set<Unit>();
  private _emitter = new EventEmitter();
  private _parent: Unit | null = null;
  private _tags: Set<string> = new Set();

  constructor(config?: UnitConfig) {
    const id = uuid4();
    const {
      behaviours,
      name,
      position,
      properties,
      rotation,
      scale,
      tags,
      type,
    } = {
      behaviours: [],
      name: `Unit-${id}`,
      position: Vector3.zero,
      rotation: Vector3.zero,
      scale: Vector3.one,
      tags: [],
      type: 'unit',
      ...config,
    };

    this.id = id;
    this.name = name;
    this.type = type;
    this.properties = Object.freeze(properties ?? {});
    tags.forEach((tag) => this.addTag(tag));

    this.transform.setPosition(position);
    this.transform.setRotation(rotation);
    this.transform.setScale(scale);

    behaviours.forEach((key) => this.addBehaviour(key));
  }

  /* Tags */
  public addTag(tag: string) {
    this._tags.add(tag);
  }

  public removeTag(tag: string) {
    this._tags.delete(tag);
  }

  public hasTag(tag: string): boolean {
    return this._tags.has(tag);
  }

  /* Tree */
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

  /* Querying */
  public findById(id: string): Unit | null {
    if (this.id === id) return this;

    for (const child of this.children) {
      if (child.id === id) return child;
      return child.findById(id);
    }

    return null;
  }

  public findByName(name: string): Unit | null {
    if (this.name === name) return this;

    for (const child of this.children) {
      if (child.name === name) return child;
      return child.findByName(name);
    }

    return null;
  }

  public findByType(type: string): Unit[] {
    const units: Unit[] = [];

    if (this.type === type) units.push(this);

    for (const child of this.children) {
      if (child.type === type) units.push(child);
      units.push(...child.findByType(type));
    }

    return units;
  }

  public findByTag(tag: string): Unit[] {
    const units: Unit[] = [];

    if (this.hasTag(tag)) units.push(this);

    for (const child of this.children) {
      if (child.hasTag(tag)) units.push(child);
      units.push(...child.findByTag(tag));
    }

    return units;
  }

  /* Behaviours */
  public addBehaviour(key: string) {
    const behaviour = BehaviourRegistry.get(key);

    if (!behaviour) {
      throw new Error(`Behaviour not found for key: ${key}`);
    }

    const controller = behaviour(this);
    if (controller) {
      this._behaviours.set(key, controller);
    }
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

  public on<E extends UnitEvent>(
    event: E,
    callback: UnitEventCallbackMap[E]
  ): VoidFunction {
    return this._onEvent(event, callback);
  }

  protected _emitEvent(event: UnitEvent, ...args: any[]): void {
    this._emitter.emit(event, ...args);
  }

  public emit(event: CustomEvent, ...args: any[]): void {
    this._emitEvent(event, ...args);
  }

  public removeAllListeners(): void {
    this._emitter.removeAllListeners();
  }

  /* Lifecycle */
  public dispose() {
    this._emitEvent('dispose');
    this._emitter.removeAllListeners();

    this.removeFromParent();
  }

  public update(state: TickerState) {
    this._emitEvent('update', state);

    this.children.forEach((child) => child.update(state));
  }
}
