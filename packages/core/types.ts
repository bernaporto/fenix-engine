import type { AnimationClip, Group } from 'three';
import type { Material, Prop, Puppet, Unit } from './Units';

/* SHARED UNIT TYPES */
export type SkinnedObject = {
  animations: AnimationClip[];
  root: Group;
};

export type UnitConfig = {
  name?: string;
};

export type UnitConfigWithMaterial = UnitConfig & {
  material?: Material | string;
};

/* SHARED GAME TYPES */
export type BehaviourController = { dispose: VoidFunction };
export type Behaviour<T extends Unit> = (unit: T) => BehaviourController;
export type BehaviourConfig =
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
