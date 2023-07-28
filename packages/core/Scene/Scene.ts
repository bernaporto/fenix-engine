import { EventEmitter } from 'eventemitter3';
import { Color, WebGLRenderer } from 'three';
import { buildHierarchy, makeEventHandler } from '../utils';
import { Camera, Unit } from '../Units';
import type {
  CustomEvent,
  EventEnabled,
  EventHandler,
  LifecycleEnabled,
  Queryable,
} from '../@types';
import type { SceneChild, SceneManifest } from '../Data/Model';
import { Ticker } from '../Tools/Ticker';
import { Layer } from './Layer';
import { SceneRegistry } from '../Game/registries';

type SceneEvent = 'load' | 'dispose' | CustomEvent;

export class Scene implements EventEnabled, LifecycleEnabled {
  public readonly events: EventHandler<SceneEvent, CustomEvent>;

  private _camera: Camera | null = null;
  private _emitter = new EventEmitter();
  private _layers = new Map<number, Layer>();
  private _properties: Record<string, any> = {};

  constructor(
    public readonly sceneId: string,
    private _renderer: WebGLRenderer
  ) {
    this.events = makeEventHandler(this._emitter);

    const sceneData = SceneRegistry.get(sceneId);
    if (!sceneData) {
      throw new Error(`Scene "${sceneId}" not found`);
    }

    this.loadScene(sceneData);
  }

  private loadScene(config: SceneManifest): void {
    const { properties } = config;

    this._properties = Object.freeze(properties ?? {});

    const getLayerFromConfig = (node: SceneChild) =>
      ('layer' in node && node.layer) || 0;

    // Build hierarchy in next tick to avoid dependency issues
    setTimeout(() => {
      buildHierarchy(
        config,
        (node) => this.getLayer(getLayerFromConfig(node)),
        (item) => {
          if (item instanceof Camera) {
            this.setCamera(item);
          }
        }
      );

      this._emitEvent('load');
    });
  }

  public get properties(): Record<string, any> {
    return this._properties;
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

  public setCamera(camera: Camera): void {
    this._camera = camera;
  }

  /* Parenting */
  public append(...units: Unit[]): void {
    this.getLayer(0).append(...units);
  }

  public getLayer(layerId: number): Layer {
    if (!this._layers.has(layerId)) {
      this._layers.set(layerId, new Layer());
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
  public findById(id: string): Queryable | null {
    for (let layer of this._layers.values()) {
      const result = layer.query.findById(id);
      if (result) return result;
    }

    return null;
  }

  public findByName(name: string): Queryable | null {
    for (let layer of this._layers.values()) {
      const result = layer.query.findByName(name);
      if (result) return result;
    }

    return null;
  }

  public findByTag(tag: string): Queryable[] {
    const results: Queryable[] = [];

    for (let layer of this._layers.values()) {
      results.push(...layer.query.findByTag(tag));
    }

    return results;
  }

  public findByType(type: string): Queryable[] {
    const results: Queryable[] = [];

    for (let layer of this._layers.values()) {
      results.push(...layer.query.findByType(type));
    }

    return results;
  }
}
