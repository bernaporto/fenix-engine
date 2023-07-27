import EventEmitter from 'eventemitter3';
import { WebGLRenderer, SRGBColorSpace, ShadowMapType } from 'three';
import type {
  CustomEvent,
  EventEnabled,
  EventHandler,
  GameSettings,
} from '../@types';
import { makeEventHandler } from '../utils';
import { loadGameManifest } from '../Data';
import { loadSceneManifest } from '../Data/manifest';
import { Ticker, type TickerState } from '../Tools/Ticker';
import {
  BehaviourRegistry,
  MaterialRegistry,
  SceneRegistry,
} from './registries';
import { Stage } from './Stage';

type GameEvent =
  | 'load'
  | 'beforeRender'
  | 'afterRender'
  | 'destroy'
  | CustomEvent;

export class Game implements EventEnabled {
  private _emitter = new EventEmitter();
  private _subscription: VoidFunction;

  public readonly events: EventHandler<GameEvent, CustomEvent>;
  public readonly renderer: WebGLRenderer;
  public readonly stage: Stage;
  public readonly ticker = Ticker;
  public readonly behaviours = {
    register: BehaviourRegistry.add,
  };

  constructor() {
    this.events = makeEventHandler(this._emitter);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = SRGBColorSpace;

    const stage = new Stage(renderer);

    this.renderer = renderer;
    this.stage = stage;

    this._subscription = Ticker.state.subscribe(this.loop.bind(this));
  }

  /* Getters */
  public get domElement() {
    return this.renderer.domElement;
  }

  /* Initialization */
  public async init({
    containerId,
    manifest,
  }: {
    manifest: string;
    containerId: string;
  }): Promise<void> {
    // Add renderer to DOM
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    container.appendChild(this.domElement);

    // Load manifest
    const {
      settings,
      scenes,
      materials = [],
    } = await loadGameManifest(manifest);

    this.applySettings(settings);

    // Add resources to registry
    materials.map(({ key, ...data }) => {
      MaterialRegistry.add(key, data);
    });

    await Promise.all(
      scenes.map(async ({ key, path }) => {
        const data = await loadSceneManifest(path);
        SceneRegistry.add(key, data);
      })
    );

    // Apply game settings
    const { initialScene } = {
      ...settings,
      initialScene: scenes[0].key,
    };

    this.stage.load(initialScene);
  }

  private applySettings(settings?: GameSettings) {
    const { enableShadows, shadowMapType, ...stageConfig } = {
      enableShadows: false,
      shadowMapType: 1,
      ...settings,
    };

    this.renderer.shadowMap.enabled = enableShadows;
    this.renderer.shadowMap.type = shadowMapType as ShadowMapType;

    this.stage.applyConfig(stageConfig);
  }

  /* Lifecycle */
  private loop({ status }: TickerState) {
    if (status === 'paused') return;

    this._emitEvent('beforeRender');

    this.stage.render();

    this._emitEvent('afterRender');
  }

  public destroy() {
    this.stage.currentScene?.dispose();
    this.renderer.dispose();
    this._subscription();

    this._emitEvent('destroy');
    this._emitter.removeAllListeners();
  }

  /* Events */
  private _emitEvent(event: GameEvent): void {
    this._emitter.emit(event);
  }
}
