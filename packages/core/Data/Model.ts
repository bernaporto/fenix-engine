import type {
  AssetUnitConfig,
  CameraConfig,
  GameSettings,
  LightConfig,
  MaterialConfig,
  MeshUnitConfig,
  PrefabConfig,
  SceneConfig,
  SkinnedUnitConfig,
  UnitConfig,
} from '../@types/config';

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
type WithType<T, U extends string> = T & {
  type: U;
};

type SceneChildModel = (
  | WithType<PrefabConfig, 'prefab'>
  | WithType<CameraConfig, 'camera'>
  | WithType<LightConfig, 'light'>
  | WithType<UnitConfig, 'unit'>
  | WithType<MeshUnitConfig, 'box' | 'plane'>
  | WithType<AssetUnitConfig, 'prop'>
  | WithType<SkinnedUnitConfig, 'puppet'>
) & {
  children?: SceneChildModel[];
};

type WithLayer<T> = T & {
  layer: number;
};

export type SceneManifest = SceneConfig & {
  hierarchy: WithLayer<SceneChildModel>[];
};

export type SceneChild = SceneChildModel | WithLayer<SceneChildModel>;

/* PREFAB MANIFEST */
export type PrefabManifest = UnitConfig & {
  hierarchy: SceneChildModel[];
};
