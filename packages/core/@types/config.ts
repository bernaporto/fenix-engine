import type {
  MeshBasicMaterialParameters,
  MeshStandardMaterialParameters,
  ShadowMapType,
} from 'three';
import type { Material } from '../Units';
import type { Queryable } from './queries';
import type { Vector2 } from '../Math';
import type { CustomProperties } from './shared';
import type { Transformable } from './transform';

// GAME
export type GameConfig = CustomProperties & {
  enableShadows?: boolean;
  initialScene?: string;
  shadowMapType?: ShadowMapType;
};

export type StageConfig = {
  autoResize?: boolean;
  backgroundColor?: number | string;
};

export type GameSettings = StageConfig & GameConfig;

export type SceneConfig = CustomProperties & {
  key: string;
};

// MATERIAL
export type MaterialConfig = { key?: string } & (
  | ({
      type: 'basic';
    } & MeshBasicMaterialParameters)
  | ({
      type: 'standard';
    } & MeshStandardMaterialParameters)
);

// UNITS
export type UnitConfig = CustomProperties &
  Partial<Transformable> &
  Partial<Omit<Queryable, 'id'>> & {
    behaviours?: string[];
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

// CAMERA
export type CameraConfig = UnitConfig & {
  angle?: Vector2;
  cameraType?: 'orthographic' | 'perspective';
  distance?: number;
  fov?: number;
  zoom?: number;
};

// LIGHT
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
