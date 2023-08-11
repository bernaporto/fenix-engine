import {
  Box,
  Camera,
  Light,
  Plane,
  Prefab,
  Prop,
  Puppet,
  Unit,
} from '../Units';
import type { PrefabManifest, SceneChild, SceneManifest } from '../Data/Model';
import type { SceneItem } from '../Scene';

type OnBuildCallback = (item: SceneItem) => void;

export const buildHierarchy = (
  { hierarchy }: SceneManifest | PrefabManifest,
  getRoot: (node: SceneChild) => SceneItem,
  onBuild?: OnBuildCallback
): void => {
  hierarchy.forEach((node) => {
    buildSceneItem(getRoot(node), onBuild)(node);
  });
};

const buildSceneItem =
  (root: SceneItem, onBuild?: OnBuildCallback) =>
  (node: SceneChild): void => {
    const { type = 'unit' } = node;

    const unitHandlerMap = {
      box: instantiate(Box),
      camera: instantiate(Camera),
      light: instantiate(Light),
      plane: instantiate(Plane),
      prop: instantiate(Prop),
      puppet: instantiate(Puppet),
      unit: instantiate(Unit),
      prefab: instantiate(Prefab),
    };

    if (!Object.keys(unitHandlerMap).includes(type)) {
      throw new Error(`Unknown unit type: ${type}`);
    }

    const unit = unitHandlerMap[type](node as any);

    if ('children' in node) {
      node.children?.forEach(buildSceneItem(unit, onBuild));
    }

    root.append(unit);
    onBuild && onBuild(unit);
  };

/* UTILS */
const instantiate =
  <T, U>(Constructor: { new (config: U): T }) =>
  (config: U) =>
    new Constructor(config);
