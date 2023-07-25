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

/* SHARED UNIT TYPES */
export type SkinnedObject = {
  animations: AnimationClip[];
  root: Group;
};

export type UnitConfig = {
  behaviours?: string[];
  initialState?: Record<string, any>;
  name?: string;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  tags?: string[];
  type?: string;
};

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

/* OTHER UNIT TYPES */
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
type EventCallback = (...args: EventArgs) => void;
export interface EventHandler {
  on(event: CustomEvent, callback: EventCallback): void;
  emit(event: CustomEvent, ...args: EventArgs): void;
  removeAllListeners(): void;
}

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

export type BehaviourController = { dispose: VoidFunction };
export type Behaviour<T extends Unit> = (unit: T) => BehaviourController;
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
