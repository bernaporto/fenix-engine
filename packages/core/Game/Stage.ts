import type { WebGLRenderer } from 'three';
import { getResizeHandler, hookResizeEvent } from './utils/handleResize';
import { Scene } from './Scene';
import { SceneRegistry } from './registries';
import { buildSceneTree } from './utils/buildSceneTree';

export type StageOptions = {
  autoResize?: boolean;
  backgroundColor?: number | string;
};

export class Stage {
  private _emptyScene = new Scene('empty');
  private _scenes: Map<string, Scene> = new Map();
  private _currentScene: Scene = this._emptyScene;

  private resize: (scene: Scene) => void;

  constructor(public readonly renderer: WebGLRenderer, options?: StageOptions) {
    renderer.autoClear = false;

    const { autoResize = true, backgroundColor = 0x000000 } = options || {};
    this.setBackgroundColor(backgroundColor);

    this.resize = getResizeHandler(renderer);

    if (autoResize) {
      hookResizeEvent(() => {
        this.resize(this._currentScene);
      });
    }
  }

  private create(id: string) {
    const scene = new Scene(id);
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
    this._currentScene.render(this.renderer);
  }

  public setBackgroundColor(color: number | string): void {
    this.currentScene.setBackgroundColor(color);
    this.renderer.setClearColor(color);
  }
}
