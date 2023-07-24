import type { Prop } from '../Units/Prop';
import type { Puppet } from '../Units/Puppet';
import type { Unit } from '../Units/Unit';

export type BehaviourController = { dispose: VoidFunction };
export type Behaviour<T extends Unit> = (unit: T) => BehaviourController;
type AddBehaviourConfig =
  | {
      type: 'unit';
      behaviour: Behaviour<Unit>;
    }
  | {
      type: 'prop';
      behaviour: Behaviour<Prop>;
    }
  | {
      type: 'puppet';
      behaviour: Behaviour<Puppet>;
    };

const registry = new Map<string, Behaviour<any>>();

export const BehaviourRegistry = {
  add: (key: string, config: AddBehaviourConfig): void => {
    registry.set(key, config.behaviour);
  },

  get: (key: string): Behaviour<Unit> | null => {
    return registry.get(key) ?? null;
  },
};
