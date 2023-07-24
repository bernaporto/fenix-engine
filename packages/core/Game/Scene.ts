import { EventEmitter } from 'eventemitter3';
import { Color, WebGLRenderer } from 'three';
import { Ticker } from '../Tools/Ticker';
import { Camera, Unit } from '../Units';
import { Layer } from './Layer';

type SceneEvent = 'dispose';

export class Scene {
  private _camera: Camera | null = null;
  private _layers = new Map<number, Layer>();
  private _emitter = new EventEmitter();

  constructor(public readonly sceneId: string) {}

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

    this.emit('dispose');
    this._emitter.removeAllListeners();
  }

  public render(renderer: WebGLRenderer): void {
    if (!this._camera) return;

    renderer.clear();
    const state = Ticker.state.get();
    const camera = this._camera.camera;

    Array.from(this._layers.entries())
      .sort((a, b) => a[0] - b[0])
      .forEach(([_, layer]) => {
        layer.update(state);

        renderer.render(layer.node, camera);
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
