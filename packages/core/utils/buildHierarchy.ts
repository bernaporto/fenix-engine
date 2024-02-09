import type { PrefabManifest, SceneChild, SceneManifest } from '../Data/Model';
import type { SceneItem } from '../Scene';
import { UnitRegistry } from '../Game/registries';

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

    const UnitConstructor = UnitRegistry.get(type);

    if (!UnitConstructor) {
      throw new Error(`Unknown unit type: ${type}`);
    }

    const unit = new UnitConstructor(node);

    if ('children' in node) {
      node.children?.forEach(buildSceneItem(unit, onBuild));
    }

    root.append(unit);
    onBuild && onBuild(unit);
  };
