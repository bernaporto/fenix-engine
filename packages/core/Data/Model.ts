import type {
  MeshBasicMaterialParameters,
  MeshStandardMaterialParameters,
} from 'three';
import type { Vector2, Vector3 } from '../Math';

type AssetModel = {
  path: string;
  preload?: boolean;
};

type ModelList<T> = Record<string, T>;
type AssetModelList = ModelList<AssetModel>;

/* MATERIAL MODEL */
export type MaterialModel =
  | ({
      key: string;
      type: 'basic';
    } & MeshBasicMaterialParameters)
  | ({
      type: 'standard';
    } & MeshStandardMaterialParameters);

/* GAME MANIFEST */
export type GameManifest = {
  scenes: AssetModelList;
  materials?: ModelList<MaterialModel>;
};

/* SCENE MANIFEST */
type SceneUnitConfig = {
  behaviours?: string[];
  children?: SceneChildModel[];
  material?: string | MaterialModel;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
};

type WithType<T, U extends string> = T & {
  type: U;
};

type SceneChildModel =
  | WithType<AssetModel, 'prefab'>
  | WithType<SceneUnitConfig, 'unit' | 'box'>
  | WithType<AssetModel & SceneUnitConfig, 'prop'>
  | WithType<AssetModel & SceneUnitConfig, 'puppet'>
  | WithType<
      Omit<SceneUnitConfig, 'children'> & {
        distance?: number;
        angle?: Vector2;
      },
      'camera'
    >;

type WithLayer<T> = T & {
  layer: number;
};

export type SceneManifest = {
  key: string;
  tree: WithLayer<SceneChildModel>[];
};

export type SceneChild = SceneChildModel | WithLayer<SceneChildModel>;
