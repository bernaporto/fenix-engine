import {
  Box,
  Camera,
  Material,
  PropFactory,
  PuppetFactory,
  Unit,
} from '../../Units';
import { Vector3 } from '../../Math';
import type {
  MaterialModel,
  SceneChild,
  SceneManifest,
} from '../../Data/Model';
import type { Scene } from '../Scene';
import { makeRegistry } from '../registries/makeRegistry';

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
        buildCamera(scene, node);

        return;
      }

      case 'unit': {
        unit = new Unit();
        break;
      }

      case 'prop': {
        const { path, preload } = node;
        const factory = getPropFactory(path, preload);

        unit = factory.instantiate({
          material: getMaterial(node.material),
        });
      }

      case 'puppet': {
        const { path, preload } = node;
        const factory = getPuppetFactory(path, preload);

        unit = factory.instantiate({
          material: getMaterial(node.material),
        });
      }

      case 'box': {
        unit = new Box({ material: getMaterial(node.material) });
        break;
      }
    }

    if (!unit) return;

    if (node.children) {
      node.children.forEach(buildSceneChild(scene, unit));
    }

    root.append(unit);
    updateTransform(unit, node);
    applyBehaviours(unit, node.behaviours ?? []);
  };

/* UTILS */
const buildCamera = (scene: Scene, node: SceneChild): void => {
  if (node.type !== 'camera') return;

  const camera = new Camera();
  scene.setCamera(camera);
  updateTransform(camera, node);

  const { angle, distance } = node;
  angle && camera.setAngle(angle);
  distance && camera.setDistance(distance);
  applyBehaviours(camera, node.behaviours ?? []);
};

const updateTransform = (
  unit: Unit,
  {
    position = Vector3.zero,
    rotation = Vector3.zero,
    scale = Vector3.one,
  }: {
    position?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
  }
): void => {
  unit.transform.setPosition(position);
  unit.transform.setRotation(rotation);
  unit.transform.setScale(scale);
};

const getMaterial = (
  material?: string | MaterialModel
): string | Material | undefined => {
  if (!material) return undefined;

  if (typeof material === 'string') {
    return material;
  }

  return new Material(material);
};

const applyBehaviours = (unit: Unit, behaviours: string[]): void =>
  behaviours.forEach((behaviour) => unit.addBehaviour(behaviour));

const factoryRegistry = makeRegistry<PropFactory | PuppetFactory>();
const getFactory =
  <T extends PropFactory | PuppetFactory>(type: 'prop' | 'puppet') =>
  (assetUrl: string, preload?: boolean): T => {
    const Factory = type === 'prop' ? PropFactory : PuppetFactory;
    return (factoryRegistry.get(assetUrl) ??
      factoryRegistry.add(assetUrl, new Factory({ assetUrl, preload }))) as T;
  };
const getPropFactory = getFactory<PropFactory>('prop');
const getPuppetFactory = getFactory<PuppetFactory>('puppet');
