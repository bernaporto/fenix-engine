import type { TickerState } from '../Tools/Ticker';
import type { Unit } from '../Units';

export type BehaviourController = {
  onDetach?: VoidFunction;
  onLoad?: VoidFunction;
  onUpdate?: (state: TickerState) => void;
};

export type Behaviour = <T extends Unit>(unit: T) => BehaviourController | void;
