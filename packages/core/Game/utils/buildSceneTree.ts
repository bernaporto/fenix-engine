import { Box, Camera, PropFactory, PuppetFactory, Unit } from '../../Units';
import type { Scene } from '../Scene';
import type { AssetModel, SceneChild, SceneManifest } from '../../Data/Model';
import { FactoryRegistry } from '../registries';

export const buildSceneTree = (scene: Scene, manifest: SceneManifest): void => {
  const { tree } = manifest;

  tree.forEach((node) => {
    const { layer = 0 } = node;
    const layerNode = scene.getLayer(layer);
    buildSceneChild(scene, layerNode)(node);
  });
};

const buildSceneChild =
  (scene: Scene, root: Unit) =>
  (node: SceneChild): void => {
    const { type } = node;
    let unit: Unit | null = null;

    switch (type) {
      case 'prefab': {
        // TODO: Implement prefab loading
        return;
      }

      case 'camera': {
        const camera = new Camera(node);
        scene.setCamera(camera);
        return;
      }

      case 'prop':
      case 'puppet': {
        unit = getFactory(node.type, node).instantiate(node);
        break;
      }

      case 'unit': {
        unit = new Unit(node);
        break;
      }

      case 'box': {
        unit = new Box(node);
        break;
      }
    }

    if (!unit) return;

    if (node.children) {
      node.children.forEach(buildSceneChild(scene, unit));
    }

    root.append(unit);
  };

/* UTILS */
const getFactory = (
  type: 'prop' | 'puppet',
  asset: AssetModel
): PropFactory | PuppetFactory => {
  const { path: assetUrl, preload } = asset;
  const Factory = type === 'prop' ? PropFactory : PuppetFactory;
  return (
    FactoryRegistry.get(assetUrl) ??
    FactoryRegistry.add(assetUrl, new Factory({ assetUrl, preload }))
  );
};
