import type { CameraConfig, MaterialConfig, UnitConfig } from '../types';

export type AssetModel = {
  path: string;
};

type ModelList<T> = Record<string, T>;
type AssetModelList = ModelList<AssetModel>;

/* MATERIAL MODEL */
type MaterialModel = MaterialConfig & {
  key: string;
};

/* GAME MANIFEST */
export type GameSettings = {
  enableShadows?: boolean;
};
export type GameManifest = {
  scenes: AssetModelList;
  materials?: ModelList<MaterialModel>;
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
  | WithType<SceneUnitConfig, 'unit' | 'box' | 'plane'>
  | WithType<AssetModel & SceneUnitConfig, 'prop'>
  | WithType<AssetModel & SceneUnitConfig, 'puppet'>;

type WithLayer<T> = T & {
  layer: number;
};

export type SceneManifest = {
  key: string;
  tree: WithLayer<SceneChildModel>[];
};

export type SceneChild = SceneChildModel | WithLayer<SceneChildModel>;
