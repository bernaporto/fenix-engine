import type { WebGLRenderer } from 'three';
import type { StageConfig } from '../types';
import { getResizeHandler, hookResizeEvent } from './utils/handleResize';
import { Scene } from './Scene';
import { SceneRegistry } from './registries';
import { buildSceneTree } from './utils/buildSceneTree';

export class Stage {
  private _config: StageConfig = {};
  private _emptyScene: Scene;
  private _currentScene: Scene;
  private _scenes: Map<string, Scene> = new Map();
  private _unsubscribeResizeEvent: VoidFunction | null = null;

  private resize: (scene: Scene) => void;

  constructor(public readonly renderer: WebGLRenderer) {
    renderer.autoClear = false;

    this._emptyScene = new Scene('empty', renderer);
    this._currentScene = this._emptyScene;

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
        this.resize(this._currentScene);
      });
    } else if (!autoResize && this._unsubscribeResizeEvent) {
      this._unsubscribeResizeEvent();
      this._unsubscribeResizeEvent = null;
    }
  }

  private create(id: string) {
    const scene = new Scene(id, this.renderer);
    this._scenes.set(id, scene);

    return scene;
  }

  public load(key: string): Scene {
    const scene = this.get(key) ?? this.create(key);
    this._currentScene = scene;

    const sceneData = SceneRegistry.get(key);
    if (sceneData) {
      buildSceneTree(scene, sceneData);
    }

    this.resize(scene);

    return scene;
  }

  public disposeScene(key: string): void {
    const scene = this._scenes.get(key);

    if (!scene) return;

    if (this._currentScene === scene) {
      this._currentScene = this._emptyScene;
    }

    scene.dispose();
    this._scenes.delete(key);
  }

  public clear(): void {
    this._scenes.forEach((scene) => {
      scene.dispose();
    });
    this._scenes.clear();
  }

  public get currentScene(): Scene {
    return this._currentScene;
  }

  public get(id: string): Scene | null {
    return this._scenes.get(id) ?? null;
  }

  public render(): void {
    this._currentScene.update();
  }

  public setBackgroundColor(color: number | string): void {
    this.currentScene.setBackgroundColor(color);
    this.renderer.setClearColor(color);
  }
}
