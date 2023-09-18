import type { WebGLRenderer } from 'three';
import type { VoidFunction } from '@fenix-engine/utilities/@types';
import { Scene } from '../Scene';
import type { StageConfig } from '../@types/config';
import { getResizeHandler, hookResizeEvent } from './utils/handleResize';

export class Stage {
  private _config: StageConfig = {};
  private _currentScene: Scene | null = null;
  private _unsubscribeResizeEvent: VoidFunction | null = null;
  private resize: (scene: Scene) => void;

  constructor(public readonly renderer: WebGLRenderer) {
    renderer.autoClear = false;
    this.resize = getResizeHandler(renderer);
  }

  public applyConfig(config: StageConfig): void {
    const stageConfig = {
      autoResize: true,
      backgroundColor: 0x242424,
      ...this._config,
      ...config,
    };
    this._config = stageConfig;

    const { autoResize, backgroundColor } = stageConfig;

    this.setBackgroundColor(backgroundColor);

    if (autoResize && !this._unsubscribeResizeEvent) {
      this._unsubscribeResizeEvent = hookResizeEvent(() => {
        this._currentScene && this.resize(this._currentScene);
      });
    } else if (!autoResize && this._unsubscribeResizeEvent) {
      this._unsubscribeResizeEvent();
      this._unsubscribeResizeEvent = null;
    }
  }

  public async load(key: string): Promise<Scene> {
    if (this._currentScene) {
      this._currentScene.dispose();
    }

    const scene = new Scene(key, this.renderer);
    this._currentScene = scene;

    await scene.load();

    this.resize(scene);

    return scene;
  }

  public get currentScene(): Scene | null {
    return this._currentScene;
  }

  public render(): void {
    this._currentScene?.update();
  }

  public setBackgroundColor(color: number | string): void {
    this.currentScene?.setBackgroundColor(color);
    this.renderer.setClearColor(color);
  }
}
