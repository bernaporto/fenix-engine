import type {
  AssetUnitConfig,
  CameraConfig,
  GameSettings,
  LightConfig,
  MaterialConfig,
  SkinnedUnitConfig,
  UnitConfig,
} from '../types';

export type AssetModel = {
  path: string;
};

type WithKey<T> = T & {
  key: string;
};

/* MATERIAL MODEL */
type MaterialModel = WithKey<MaterialConfig>;

/* GAME MANIFEST */
export type GameManifest = {
  scenes: WithKey<AssetModel>[];
  materials?: MaterialModel[];
  settings?: GameSettings;
};

/* SCENE MANIFEST */
type SceneUnitConfig = UnitConfig & {
  children?: SceneChildModel[];
  material?: MaterialModel | string;
};

type WithType<T, U extends string> = T & {
  type: U;
};

type SceneChildModel =
  | WithType<AssetModel, 'prefab'>
  | WithType<CameraConfig, 'camera'>
  | WithType<LightConfig, 'light'>
  | WithType<SceneUnitConfig, 'unit' | 'box' | 'plane'>
  | WithType<AssetUnitConfig, 'prop'>
  | WithType<SkinnedUnitConfig, 'puppet'>;

type WithLayer<T> = T & {
  layer: number;
};

export type SceneManifest = {
  key: string;
  tree: WithLayer<SceneChildModel>[];
};

export type SceneChild = SceneChildModel | WithLayer<SceneChildModel>;
