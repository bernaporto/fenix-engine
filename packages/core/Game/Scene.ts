import { EventEmitter } from 'eventemitter3';
import { Color, WebGLRenderer } from 'three';
import type {
  CustomEvent,
  EventHandler,
  Eventable,
  Queryable,
  SceneConfig,
  SceneUnit,
} from '../types';
import { Ticker } from '../Tools/Ticker';
import { Camera, Unit } from '../Units';
import { Layer } from './Layer';
import { makeEventHandler } from '../Units/utils';

type SceneEvent = 'dispose' | CustomEvent;

export class Scene implements Eventable, Queryable, SceneUnit {
  public readonly events: EventHandler<SceneEvent, CustomEvent>;
  public readonly properties: Record<string, any> = {};
  public readonly sceneId: string;

  private _camera: Camera | null = null;
  private _emitter = new EventEmitter();
  private _layers = new Map<number, Layer>();

  constructor(config: SceneConfig, private _renderer: WebGLRenderer) {
    this.events = makeEventHandler(this._emitter);

    const { key, properties } = config;

    this.properties = Object.freeze(properties ?? {});
    this.sceneId = key;
  }

  /* Background */
  public setBackgroundColor(color: number | string): void {
    this._layers.forEach((layer) => {
      layer.background = new Color(color);
    });
  }

  /* Camera */
  public get camera(): Camera | null {
    return this._camera;
  }

  public setCamera(camera: Camera, layer = 0): void {
    this._camera = camera;
    this.getLayer(layer).append(camera);
  }

  /* Parenting */
  public append(unit: Unit): void {
    this.getLayer(0).append(unit);
  }

  public getLayer(layerId: number): Layer {
    if (!this._layers.has(layerId)) {
      this._layers.set(layerId, new Layer(layerId));
    }

    return this._layers.get(layerId) as Layer;
  }

  /* Lifecycle */
  public dispose(): void {
    this._layers.forEach((layer) => {
      layer.dispose();
    });
    this._layers.clear();

    this._emitEvent('dispose');
    this._emitter.removeAllListeners();
  }

  public update(): void {
    if (!this._camera) return;

    this._renderer.clear();
    const state = Ticker.state.get();
    const camera = this._camera.camera;

    Array.from(this._layers.entries())
      .sort((a, b) => a[0] - b[0])
      .forEach(([_, layer]) => {
        layer.update(state);

        this._renderer.render(layer.node, camera);
        this._renderer.clearDepth();
      });
  }

  /* Events */
  protected _emitEvent(event: SceneEvent): void {
    this._emitter.emit(event);
  }

  /* Queryable */
  public findById(id: string): Unit | null {
    for (let layer of this._layers.values()) {
      const result = layer.findById(id);
      if (result) return result;
    }

    return null;
  }

  public findByName(name: string): Unit | null {
    for (let layer of this._layers.values()) {
      const result = layer.findByName(name);
      if (result) return result;
    }

    return null;
  }

  public findByTag(tag: string): Unit[] {
    const results: Unit[] = [];

    for (let layer of this._layers.values()) {
      results.push(...layer.findByTag(tag));
    }

    return results;
  }

  public findByType(type: string): Unit[] {
    const results: Unit[] = [];

    for (let layer of this._layers.values()) {
      results.push(...layer.findByType(type));
    }

    return results;
  }
}
