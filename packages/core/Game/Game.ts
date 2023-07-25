import { WebGLRenderer, SRGBColorSpace, ShadowMapType } from 'three';
import { GameSettings } from '../types';
import { loadGameManifest } from '../Data';
import { loadSceneManifest } from '../Data/manifest';
import { Ticker, type TickerState } from '../Tools/Ticker';
import { MaterialRegistry, SceneRegistry } from './registries';
import { Stage } from './Stage';

export class Game {
  private _renderer: WebGLRenderer;
  private _stage: Stage;
  private _subscription: VoidFunction;

  constructor() {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = SRGBColorSpace;

    const stage = new Stage(renderer);

    this._renderer = renderer;
    this._stage = stage;

    this._subscription = Ticker.state.subscribe(this.loop.bind(this));
  }

  public get domElement() {
    return this.renderer.domElement;
  }

  public get renderer() {
    return this._renderer;
  }

  public get stage() {
    return this._stage;
  }

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

  private loop({ status }: TickerState) {
    if (status === 'paused') return;

    this._stage.render();
  }

  public destroy() {
    this._stage.clear();
    this._renderer.dispose();
    this._subscription();
  }
}
