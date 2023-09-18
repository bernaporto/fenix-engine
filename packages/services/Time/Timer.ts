import { Ticker, type TickerState } from '@fenix-engine/core/Tools/Ticker';
import type { VoidFunction } from '@fenix-engine/utilities/@types';

export class Timer {
  private _timers = new Map<number, VoidFunction>();
  private _unsubscribe = Ticker.state.subscribe(this.update.bind(this));

  setTimer(callback: VoidFunction, ms: number): VoidFunction {
    let canceled = false;

    const { elapsedTime } = Ticker.state.get();
    this._timers.set(elapsedTime + ms / 1000, () => {
      if (canceled) return;

      callback();
    });

    return () => (canceled = true);
  }

  setInterval(callback: VoidFunction, ms: number): VoidFunction {
    let canceled = false;

    const { elapsedTime } = Ticker.state.get();
    this._timers.set(elapsedTime + ms / 1000, () => {
      if (canceled) return;

      callback();
      this.setInterval(callback, ms);
    });

    return () => (canceled = true);
  }

  private update({ elapsedTime }: TickerState) {
    this._timers.forEach((callback, key) => {
      if (key > elapsedTime) return;

      callback();
      this._timers.delete(key);
    });
  }

  public clear() {
    this._timers.clear();
  }

  public dispose() {
    this.clear();
    this._unsubscribe();
  }
}
