import { WebGLRenderer, SRGBColorSpace, type ShadowMapType } from 'three';
import type {
  CustomEvent,
  EventEnabled,
  PublicEventHandler,
} from '@fenix-engine/utilities/events/types';
import {
  makeEventEmitter,
  makePublicEventHandler,
} from '@fenix-engine/utilities/events';
import type { VoidFunction } from '@fenix-engine/utilities/@types';
import type { GameSettings, StageConfig } from '../@types';
import { loadGameManifest } from '../Data';
import { Ticker, type TickerState } from '../Tools/Ticker';
import {
  BehaviourRegistry,
  MaterialRegistry,
  SceneRegistry,
  UnitRegistry,
} from './registries';
import { Stage } from './Stage';

type GameEvent =
  | 'load'
  | 'beforeRender'
  | 'afterRender'
  | 'destroy'
  | CustomEvent;

export class Game implements EventEnabled {
  private _emitter = makeEventEmitter();
  private _subscription: VoidFunction;

  public readonly events: PublicEventHandler<GameEvent, CustomEvent>;
  public readonly renderer: WebGLRenderer;
  public readonly stage: Stage;
  public readonly ticker = Ticker;
  public readonly behaviours = {
    register: BehaviourRegistry.add,
  };
  public readonly units = {
    register: UnitRegistry.add,
  };

  constructor() {
    this.events = makePublicEventHandler(this._emitter);

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
    initialScene,
  }: {
    containerId: string;
    manifest: string;
    initialScene?: string;
  }): Promise<GameSettings> {
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

    this.applySettings({ ...settings, initialScene });

    // Add resources to registry
    materials.forEach(({ key, ...data }) => {
      MaterialRegistry.add(key, data);
    });

    scenes.forEach(({ key, path }) => {
      SceneRegistry.add(key, { path });
    });

    // Load initial scene if provided
    if (initialScene) {
      this.stage.load(initialScene);
    }

    // Apply game settings
    return {
      ...settings,
      initialScene: initialScene ?? settings?.initialScene ?? scenes[0].key,
    };
  }

  private applySettings(settings?: GameSettings) {
    const {
      alpha,
      enableShadows,
      shadowMapType,
    } = {
      alpha: false,
      enableShadows: false,
      shadowMapType: 1,
      ...settings,
    };

    this.renderer.setClearColor(
      0x000000,
      typeof alpha === 'boolean' ? (alpha ? 0 : 1) : alpha
    );

    this.renderer.shadowMap.enabled = enableShadows;
    this.renderer.shadowMap.type = shadowMapType as ShadowMapType;

    const stageConfig: StageConfig = {};
    if (settings?.autoResize !== undefined) {
      stageConfig.autoResize = settings.autoResize;
    }
    if (settings?.backgroundColor !== undefined) {
      stageConfig.backgroundColor = settings.backgroundColor;
    }
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
    this.stage.dispose();
    this.renderer.dispose();
    this._subscription();

    this._emitEvent('destroy');
    this._emitter.clear();
  }

  /* Events */
  private _emitEvent(event: GameEvent): void {
    this._emitter.emit(event);
  }
}
