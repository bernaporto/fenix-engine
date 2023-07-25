import { Box, Camera, Light, Plane, Prop, Puppet, Unit } from '../../Units';
import type { SceneChild, SceneManifest } from '../../Data/Model';
import type { Scene } from '../Scene';

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
    const { type = 'unit' } = node;

    if (!Object.keys(unitHandlerMap).includes(type)) {
      throw new Error(`Unknown unit type: ${type}`);
    }

    const unit = unitHandlerMap[type](node);

    if (unit instanceof Camera) {
      scene.setCamera(unit);
    }

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
  camera: instantiate(Camera),
  light: instantiate(Light),
  plane: instantiate(Plane),
  prop: instantiate(Prop),
  puppet: instantiate(Puppet),
  unit: instantiate(Unit),

  prefab: (_: any) => {
    throw new Error('Prefab loading not implemented');
  },
};
