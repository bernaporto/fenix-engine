import EventEmitter from 'eventemitter3';
import {
  BehaviourController,
  BehaviourRegistry,
} from '../Game/registries/BehaviourRegistry';
import {
  CustomEvent,
  EventHandler,
  EventEnabled,
  Queryable,
  QueryEnabled,
  UnitConfig,
} from '../@types';
import type { TickerState } from '../Tools/Ticker';
import {
  makeEventHandler,
  makeQueryHandler,
  makeTransformController,
} from '../utils';
import { SceneItem } from '../Scene';

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
export class Unit
  extends SceneItem
  implements EventEnabled, Queryable, QueryEnabled
{
  public readonly events: EventHandler<UnitEvent, CustomEvent>;
  public readonly query = makeQueryHandler(this);
  public readonly transform = makeTransformController(this);

  private _behaviours = new Map<string, BehaviourController>();
  private _emitter = new EventEmitter();
  private _name: string = `Unit-${this.id}`;
  private _properties: Record<string, any> = {};
  private _tags: Set<string> = new Set();
  private _type: string = 'unit';

  constructor(config?: UnitConfig) {
    super();
    this.events = makeEventHandler(this._emitter);

    this.applyConfig(config ?? {});
  }

  protected applyConfig(config: UnitConfig): void {
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
      name: this.name,
      position: this.transform.position,
      rotation: this.transform.rotation,
      scale: this.transform.scale,
      tags: [],
      type: this.type,
      ...config,
    };

    this._name = name;
    this._type = type;
    this._properties = properties ?? {};
    tags.forEach((tag) => this.addTag(tag));

    this.transform.setPosition(position);
    this.transform.setRotation(rotation);
    this.transform.setScale(scale);

    behaviours.forEach((key) => this.addBehaviour(key));
  }

  get name(): string {
    return this._name;
  }

  get type(): string {
    return this._type;
  }

  get properties(): Record<string, any> {
    return this._properties;
  }

  protected setName(name: string) {
    this._name = name;
  }

  protected setType(type: string) {
    this._type = type;
  }

  protected setProperty(key: string, value: unknown) {
    this.properties[key] = value;
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

  /* Behaviours */
  public addBehaviour(key: string) {
    const Behaviour = BehaviourRegistry.get(key);

    if (!Behaviour || typeof Behaviour !== 'function') {
      throw new Error(`Behaviour not found for key: ${key}`);
    }

    const controller = Behaviour(this);

    if (controller) {
      this._behaviours.set(key, controller);
      controller.onAttach?.();
    }
  }

  public removeBehaviour(key: string) {
    const controller = this._behaviours.get(key);

    if (controller) {
      controller.onDetach?.();
      this._behaviours.delete(key);
    }
  }

  /* Events */
  protected _emitEvent(event: UnitEvent, ...args: any[]): void {
    this._emitter.emit(event, ...args);
  }

  /* Lifecycle */
  public override dispose() {
    this._emitEvent('dispose');
    this._emitter.removeAllListeners();

    super.dispose();
  }

  public override update(state: TickerState) {
    this._emitEvent('update', state);

    super.update(state);

    this._behaviours.forEach((controller) => controller.onUpdate?.(state));
  }
}
