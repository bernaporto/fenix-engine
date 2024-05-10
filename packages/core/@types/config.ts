import type {
  MeshBasicMaterialParameters,
  MeshStandardMaterialParameters,
  ShaderMaterialParameters,
  ShadowMapType,
} from 'three';
import type { Material } from '../Units';
import type { Queryable } from './queries';
import type { Vector2, Vector3 } from '../Math';
import type { CustomProperties } from './shared';
import type { Transformable } from './transform';

// GAME
export type GameConfig = CustomProperties & {
  alha?: boolean | number;
  enableShadows?: boolean;
  initialScene?: string;
  shadowMapType?: ShadowMapType;
};

export type StageConfig = {
  autoResize?: boolean;
  backgroundColor?: number | string | null;
};

export type GameSettings = StageConfig & GameConfig;

export type SceneConfig = CustomProperties & {
  key: string;
};

// MATERIAL
export type MaterialAssetConfig = {
  alphaMap?: string;
  map?: string;
};

export type MaterialConfig = { key?: string; assets?: MaterialAssetConfig } & (
  | ({
      type: 'basic';
    } & MeshBasicMaterialParameters)
  | ({
      type: 'rawShader';
    } & ShaderMaterialParameters)
  | ({
      type: 'standard';
    } & MeshStandardMaterialParameters)
);

// UNITS
export type AssetConfig = {
  path: string;
};

export type UnitConfig = CustomProperties &
  Partial<Transformable> &
  Partial<Omit<Queryable, 'id'>> & {
    id?: string;
  };

export type MeshUnitConfig = UnitConfig & {
  castShadow?: boolean;
  material?: Material | MaterialConfig | string;
  receiveShadow?: boolean;
};

export type AssetUnitConfig = MeshUnitConfig & AssetConfig;

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
  target?: Vector3;
};

// PREFAB
export type PrefabConfig = AssetConfig & UnitConfig;
