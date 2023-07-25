import { WebGLRenderer, SRGBColorSpace, PCFShadowMap } from 'three';
import { isNotNullable } from '@fenix-engine/utilities/misc';
import { Ticker, type TickerState } from '../Tools/Ticker';
import { Stage, type StageOptions } from './Stage';
import { loadGameManifest } from '../Data';
import { MaterialRegistry, SceneRegistry } from './registries';
import { loadSceneManifest } from '../Data/manifest';
import { GameSettings } from '../Data/Model';

export type GameConfig = StageOptions & {
  /**
   * The path to the manifest file. This file must contain all game configuration info.
   */
  manifest: string;
  container?: HTMLElement;
};

export class Game {
  private _renderer: WebGLRenderer;
  private _stage: Stage;
  private _subscription: VoidFunction;

  constructor(private options: GameConfig) {
    const { container } = options;

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = SRGBColorSpace;

    if (isNotNullable(container)) {
      container.appendChild(renderer.domElement);
    }

    const stage = new Stage(renderer, options);

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

  public async load(): Promise<void> {
    const { manifest } = this.options;

    const {
      settings,
      scenes,
      materials = {},
    } = await loadGameManifest(manifest);

    this.applySettings(settings);

    await Promise.all([
      ...Object.entries(scenes).map(async ([key, value]) => {
        const data = await loadSceneManifest(value.path);
        SceneRegistry.add(key, data);
      }),
      ...Object.entries(materials).map(([key, value]) => {
        MaterialRegistry.add(key, value);
      }),
    ]);
  }

  private applySettings(settings?: GameSettings) {
    const { enableShadows = false } = settings ?? {};

    if (enableShadows) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = PCFShadowMap;
    }
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
