import { WebGLRenderer, SRGBColorSpace } from 'three';
import { isNotNullable } from '@fenix-engine/shared/utils';
import { Ticker, type TickerState } from '../Tools/Ticker';
import { Stage, type StageOptions } from './Stage';

export type GameConfig = StageOptions & {
  container?: HTMLElement;
};

export class Game {
  private _renderer: WebGLRenderer;
  private _stage: Stage;
  private _subscription: VoidFunction;

  constructor(options?: GameConfig) {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = SRGBColorSpace;

    const { container } = options ?? {};

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
