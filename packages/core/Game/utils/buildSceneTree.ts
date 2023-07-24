import { Box, Camera, Prop, Puppet, Unit } from '../../Units';
import type { Scene } from '../Scene';
import type { SceneChild, SceneManifest } from '../../Data/Model';

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

    if (type === 'camera') {
      const camera = new Camera(node);
      scene.setCamera(camera);
      return;
    }

    if (!Object.keys(unitHandlerMap).includes(type)) {
      throw new Error(`Unknown unit type: ${type}`);
    }

    const unit = unitHandlerMap[type](node);

    if ('children' in node) {
      node.children?.forEach(buildSceneChild(scene, unit));
    }

    root.append(unit);
  };

/* UTILS */
const instantiate =
  <T, U>(Constructor: { new (config: U): T }) =>
  (config: U) =>
    new Constructor(config);

const unitHandlerMap = {
  box: instantiate(Box),
  plane: instantiate(Box),
  unit: instantiate(Unit),
  prop: instantiate(Prop),
  puppet: instantiate(Puppet),
  prefab: (_: any) => {
    throw new Error('Prefab loading not implemented');
  },
};
