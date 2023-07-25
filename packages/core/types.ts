import type {
  AnimationClip,
  Group,
  MeshBasicMaterialParameters,
  MeshStandardMaterialParameters,
} from 'three';
import type { Material, Prop, Puppet, Unit } from './Units';
import type { Vector2, Vector3 } from './Math';

/* SHARED UNIT TYPES */
export type SkinnedObject = {
  animations: AnimationClip[];
  root: Group;
};

export type UnitConfig = {
  behaviours?: string[];
  name?: string;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
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

/* SHARED GAME TYPES */
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
