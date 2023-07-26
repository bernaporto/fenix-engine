import EventEmitter from 'eventemitter3';
import { WebGLRenderer, SRGBColorSpace, ShadowMapType } from 'three';
import type { GameSettings } from '../types';
import { loadGameManifest } from '../Data';
import { loadSceneManifest } from '../Data/manifest';
import { Ticker, type TickerState } from '../Tools/Ticker';
import {
  BehaviourRegistry,
  MaterialRegistry,
  SceneRegistry,
} from './registries';
import { Stage } from './Stage';

type GameEvents = 'load' | 'beforeRender' | 'afterRender' | 'destroy';

export class Game {
  private _emitter = new EventEmitter();
  private _subscription: VoidFunction;

  public readonly renderer: WebGLRenderer;
  public readonly stage: Stage;
  public readonly ticker = Ticker;
  public readonly behaviours = {
    register: BehaviourRegistry.add,
  };

  constructor() {
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

    this._emitter.emit('beforeRender');

    this.stage.render();

    this._emitter.emit('afterRender');
  }

  public destroy() {
    this.stage.currentScene?.dispose();
    this.renderer.dispose();
    this._subscription();

    this._emitter.emit('destroy');
    this._emitter.removeAllListeners();
  }

  /* Events */
  public on(event: GameEvents, callback: VoidFunction): VoidFunction {
    this._emitter.on(event, callback);

    return () => this._emitter.off(event, callback);
  }
}
