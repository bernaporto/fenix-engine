import { Color, WebGLRenderer } from 'three';
import type {
  CustomEvent,
  EventEnabled,
  PublicEventHandler,
} from '@fenix-engine/utilities/events/types';
import {
  makeEventEmitter,
  makePublicEventHandler,
} from '@fenix-engine/utilities/events';
import { buildHierarchy } from '../utils';
import { Camera, Unit } from '../Units';
import { getPropertiesHandler } from '../Units/utils';
import type { LifecycleEnabled, Queryable } from '../@types';
import type { SceneChild, SceneManifest } from '../Data/Model';
import { SceneRegistry } from '../Game/registries';
import { Ticker } from '../Tools/Ticker';
import { Layer } from './Layer';

type SceneEvent = 'load' | 'dispose' | CustomEvent;

export class Scene implements EventEnabled, LifecycleEnabled {
  public readonly events: PublicEventHandler<SceneEvent, CustomEvent>;
  public readonly properties = getPropertiesHandler({});

  private _camera: Camera | null = null;
  private _emitter = makeEventEmitter();
  private _layers = new Map<number, Layer>();

  constructor(
    public readonly sceneId: string,
    private _renderer: WebGLRenderer
  ) {
    this.events = makePublicEventHandler(this._emitter);
  }

  public async load(): Promise<void> {
    const sceneDataPromise = SceneRegistry.get(this.sceneId);
    if (!sceneDataPromise) {
      throw new Error(`Scene "${this.sceneId}" not found`);
    }

    const sceneData = await sceneDataPromise;

    this.buildScene(sceneData);
    this._emitEvent('load');
  }

  private buildScene(config: SceneManifest): void {
    const { properties } = config;

    this.properties.setState(properties ?? {});

    const getLayerFromConfig = (node: SceneChild) =>
      ('layer' in node && node.layer) || 0;

    buildHierarchy(
      config,
      (node) => this.getLayer(getLayerFromConfig(node)),
      (item) => {
        if (item instanceof Camera) {
          this.setCamera(item);
        }
      }
    );
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
    this._emitter.clear();
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
