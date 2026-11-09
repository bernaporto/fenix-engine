import type { WebGLRenderer } from 'three';
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
import { Scene } from '../Scene';
import { getResizeHandler, hookResizeEvent } from './utils/handleResize';
import { StageConfig, StageResize } from '../@types';

type StageEvent = 'resize' | CustomEvent;

export class Stage implements EventEnabled {
  private _emitter = makeEventEmitter<StageEvent>();
  public readonly events: PublicEventHandler<StageEvent, CustomEvent>;
  private _config: StageConfig = {};
  private _currentScene: Scene | null = null;
  private _unsubscribeResizeEvent: VoidFunction | null = null;
  private _size: StageResize | null = null;
  private resize: (scene: Scene | null) => void;

  constructor(public readonly renderer: WebGLRenderer) {
    this.events = makePublicEventHandler(this._emitter);
    renderer.autoClear = false;

    const resize = getResizeHandler(renderer);
    this.resize = (scene) => {
      const size = resize(scene);
      if (!size) return;

      this._size = size;
      this._emitter.emit('resize', size);
    };
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
      this._unsubscribeResizeEvent = hookResizeEvent(
        this.renderer.domElement.parentElement,
        () => this.resize(this._currentScene),
      );
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

  public get size(): StageResize | null {
    return this._size;
  }

  public render(): void {
    this._currentScene?.update();
  }

  public setBackgroundColor(color: number | string | null): void {
    this.currentScene?.setBackgroundColor(color);
  }

  public dispose(): void {
    this._unsubscribeResizeEvent?.();
    this._unsubscribeResizeEvent = null;
    this._currentScene?.dispose();
    this._currentScene = null;
    this._size = null;
    this._emitter.clear();
  }
}
