import type { Unit } from '../../Units';
import type {
  Behaviour,
  BehaviourConfig,
  BehaviourController,
} from '../../types';
import { makeRegistry } from './makeRegistry';

export type { BehaviourController };

export const BehaviourRegistry = makeRegistry<BehaviourConfig, Behaviour<Unit>>(
  {
    process: (config) => config.behaviour as Behaviour<Unit>,
  }
);
