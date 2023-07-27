import type {
  AnimationClip,
  Group,
  MeshBasicMaterialParameters,
  MeshStandardMaterialParameters,
  ShadowMapType,
} from 'three';
import type { Material, Prop, Puppet, Unit } from './Units';
import type { Vector2, Vector3 } from './Math';
import { TickerState } from './Tools/Ticker';

type WithCustomProperties<T> = T & {
  properties?: Record<string, any>;
};

/* GAME TYPES */
export type GameConfig = {
  enableShadows?: boolean;
  initialScene?: string;
  shadowMapType?: ShadowMapType;
};

export type StageConfig = {
  autoResize?: boolean;
  backgroundColor?: number | string;
};

export type GameSettings = StageConfig & GameConfig;

export type SceneConfig = WithCustomProperties<{
  key: string;
}>;

/* SHARED UNIT TYPES */
export type SkinnedObject = {
  animations: AnimationClip[];
  root: Group;
};

export type UnitConfig = WithCustomProperties<{
  behaviours?: string[];
  name?: string;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  tags?: string[];
  type?: string;
}>;

export type MeshUnitConfig = UnitConfig & {
  castShadow?: boolean;
  material?: Material | MaterialConfig | string;
  receiveShadow?: boolean;
};

export type AssetUnitConfig = MeshUnitConfig & {
  path: string;
};

export type SkinnedUnitConfig = AssetUnitConfig & {
  defaultClip: string;
};

/* SCENE UNIT INTERFACES */
export interface Queryable {
  findById(id: string): Unit | null;
  findByName(name: string): Unit | null;
  findByTag(tag: string): Unit[];
  findByType(type: string): Unit[];
}

export interface SceneUnit {
  dispose(): void;
  update(state: TickerState): void;
}

export type CustomEvent = `custom:${string}`;
type EventArgs = any[];
export type EventCallback = (...args: EventArgs) => void;
export type Eventable = {
  events: EventHandler<string>;
};
export interface EventHandler<T extends string, U extends string = T> {
  on(event: T, callback: EventCallback): VoidFunction;
  once(event: T, callback: EventCallback): VoidFunction;
  emit(event: U, ...args: EventArgs): void;
  clear(): void;
}

/* OTHER UNIT TYPES */
export type CameraConfig = UnitConfig & {
  angle?: Vector2;
  cameraType?: 'orthographic' | 'perspective';
  distance?: number;
  fov?: number;
  zoom?: number;
};

export type LightConfig = UnitConfig & {
  castShadow?: boolean;
  color?: string;
  decay?: number;
  distance?: number;
  intensity?: number;
  lightType?: 'ambient' | 'directional' | 'point';
  shadowMapWidth?: number;
  shadowMapHeight?: number;
};

export type MaterialConfig = { key?: string } & (
  | ({
      type: 'basic';
    } & MeshBasicMaterialParameters)
  | ({
      type: 'standard';
    } & MeshStandardMaterialParameters)
);

/* BEHAVIOUR TYPES */
export type BehaviourController = {
  onAttach?: VoidFunction;
  onDetach?: VoidFunction;
  onUpdate?: (state: TickerState) => void;
};
export type BehaviourClass<T extends Unit> = new (
  unit: T
) => BehaviourController;
type BehaviourFn<T extends Unit> = (unit: T) => BehaviourController | void;
export type Behaviour<T extends Unit> = BehaviourClass<T> | BehaviourFn<T>;
export type BehaviourConfig =
  | {
      type?: 'unit';
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
