import type { AnimationClip, Group } from 'three';
import type { TickerState } from '../Tools/Ticker';

export type LifecycleEvents = 'dispose' | 'update';

export type LifecycleEnabled = {
  dispose(): void;
  update(state: TickerState): void;
};

export type CustomProperties = {
  properties?: Record<string, any>;
};

export type SkinnedObject = {
  animations: AnimationClip[];
  root: Group;
};

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];
