import type {
  CustomEvent,
  EventEnabled,
  PublicEventHandler,
} from '@fenix-engine/utilities/events/types';
import {
  makeEventEmitter,
  makePublicEventHandler,
} from '@fenix-engine/utilities/events';
import { postpone } from '@fenix-engine/utilities/functional';
import type { VoidFunction } from '@fenix-engine/utilities/@types';
import {
  BehaviourController,
  BehaviourRegistry,
} from '../Game/registries/BehaviourRegistry';
import { Queryable, QueryEnabled, UnitConfig } from '../@types';
import type { TickerState } from '../Tools/Ticker';
import { makeQueryHandler, makeTransformController } from '../utils';
import { SceneItem } from '../Scene';
import {
  PropertiesHandler,
  assignUnitToNode,
  getPropertiesHandler,
} from './utils';

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
  public readonly events: PublicEventHandler<UnitEvent, CustomEvent>;
  public readonly properties: PropertiesHandler;
  public readonly query = makeQueryHandler(this);
  public readonly transform = makeTransformController(this);

  private _behaviours = new Map<string, BehaviourController>();
  private _emitter = makeEventEmitter();
  private _name: string = `Unit-${this.id}`;
  private _tags: Set<string> = new Set();
  private _type: string = 'unit';

  constructor(config?: UnitConfig) {
    super();
    this.events = makePublicEventHandler(this._emitter);
    this.properties = getPropertiesHandler(config?.properties ?? {});

    this.applyConfig(config ?? {});
    assignUnitToNode(this);
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
      properties: {},
      rotation: this.transform.rotation,
      scale: this.transform.scale,
      tags: [],
      type: this.type,
      ...config,
    };

    this._name = name;
    this._type = type;
    this.properties.setState(properties);
    tags.forEach((tag) => this.addTag(tag));

    this.transform.setPosition(position);
    this.transform.setRotation(rotation);
    this.transform.setScale(scale);

    // Add behaviours only after the unit is fully loaded
    postpone(() => {
      behaviours.forEach((key) => this.addBehaviour(key));
    });
  }

  /* Getters */
  get behaviours(): string[] {
    return [...this._behaviours.keys()];
  }

  get name(): string {
    return this._name;
  }

  get type(): string {
    return this._type;
  }

  protected setName(name: string) {
    this._name = name;
  }

  protected setType(type: string) {
    this._type = type;
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

    // Remove previous behaviour if exists
    this.removeBehaviour(key);

    const controller = Behaviour(this);
    this.events.once('load', () => controller?.onLoad?.());

    if (controller) {
      this._behaviours.set(key, controller);
    }
  }

  getBehaviour<T extends BehaviourController>(key: string): T | undefined {
    return this._behaviours.get(key) as T;
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
    this._emitter.clear();

    super.dispose();
  }

  public override update(state: TickerState) {
    this._emitEvent('update', state);

    super.update(state);

    this._behaviours.forEach((controller) => controller.onUpdate?.(state));
  }
}
