import { EventEmitter } from 'eventemitter3';
import { Color, WebGLRenderer } from 'three';
import { Ticker } from '../Tools/Ticker';
import { Camera, Unit } from '../Units';
import { Layer } from './Layer';

type SceneEvent = 'dispose';

export class Scene {
  public readonly camera = new Camera();

  private _layers = new Map<number, Layer>();
  private _emitter = new EventEmitter();

  constructor(public readonly sceneId: string) {
    this.getLayer(0).append(this.camera);
  }

  public setBackgroundColor(color: number | string): void {
    this._layers.forEach((layer) => {
      layer.background = new Color(color);
    });
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

    this.emit('dispose');
    this._emitter.removeAllListeners();
  }

  public render(renderer: WebGLRenderer): void {
    renderer.clear();
    const state = Ticker.state.get();

    Array.from(this._layers.entries())
      .sort((a, b) => a[0] - b[0])
      .forEach(([_, layer]) => {
        layer.update(state);

        renderer.render(layer.node, this.camera.camera);
        renderer.clearDepth();
      });
  }

  /* Events */
  public on(event: SceneEvent, callback: VoidFunction): VoidFunction {
    this._emitter.addListener(event, callback);

    return () => {
      this._emitter.removeListener(event, callback);
    };
  }

  protected emit(event: SceneEvent): void {
    this._emitter.emit(event);
  }
}
