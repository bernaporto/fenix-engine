import type {
  AmbientLight,
  DirectionalLight,
  Object3D,
  PointLight,
} from 'three';
import { Mesh } from 'three';
import { degreesToRadians } from '@fenix-engine/utilities/misc';
import type { LightConfig, MeshUnitConfig } from '../types';
import { Vector3 } from '../Math';
import { Material } from './Material';
import type { Unit } from './Unit';

/* MESH UTILS */
export const applyMeshConfig = (
  obj: Object3D,
  config: MeshUnitConfig
): void => {
  const {
    material: materialConfig,
    castShadow,
    receiveShadow,
  } = {
    castShadow: false,
    receiveShadow: false,
    ...config,
  };

  const material = getMaterial(materialConfig);

  if (material === null) {
    throw new Error(`Material "${materialConfig}" not found`);
  }

  const applyConfig = (child: Object3D) => {
    if (isMesh(child)) {
      material && (child.material = material.build());

      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;
    }
  };

  applyConfig(obj);
  obj.traverse(applyConfig);
};

const getMaterial = (
  materialConfig: MeshUnitConfig['material']
): Material | null | undefined => {
  if (!materialConfig) return;

  return materialConfig instanceof Material
    ? materialConfig
    : Material.load(materialConfig);
};

const isMesh = (obj: Object3D): obj is Mesh =>
  obj instanceof Mesh || (obj as any).isMesh;

/* LIGHT UTILS */
export const applyLightConfig = (
  light: AmbientLight | DirectionalLight | PointLight,
  config: LightConfig
): void => {
  const {
    castShadow,
    color,
    decay,
    distance,
    intensity,
    shadowMapWidth,
    shadowMapHeight,
  }: LightConfig = {
    castShadow: false,
    color: '#ffffff',
    decay: 2,
    distance: 0,
    intensity: 1,
    shadowMapWidth: 512,
    shadowMapHeight: 512,
    ...config,
  };

  light.castShadow = castShadow;
  light.color.set(color);
  'decay' in light && (light.decay = decay);
  'distance' in light && (light.distance = distance);
  light.intensity = intensity;
  light.shadow &&
    ((light.shadow.mapSize.width = shadowMapWidth),
    (light.shadow.mapSize.height = shadowMapHeight));
};

/* TRANSFORM UTILS */

export type TransformController = {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  lookAt: (target: Vector3) => void;

  setPosition: (value: Vector3) => void;
  setRotation: (value: Vector3) => void;
  setScale: (value: Vector3) => void;

  rotateX: (value: number) => void;
  rotateY: (value: number) => void;
  rotateZ: (value: number) => void;
};

export const makeTransformController = (unit: Unit): TransformController => {
  let position = Vector3.create();
  let rotation = Vector3.create();
  let scale = Vector3.create();

  const node = unit.node;

  return {
    get position() {
      return Vector3.copy(position);
    },

    get rotation() {
      return Vector3.copy(rotation);
    },

    get scale() {
      return Vector3.copy(scale);
    },

    lookAt: (target: Vector3) => {
      node.lookAt(target.x, target.y, target.z);
    },

    rotateX: (value: number) => {
      node.rotateX(degreesToRadians(value));
    },

    rotateY: (value: number) => {
      node.rotateY(degreesToRadians(value));
    },

    rotateZ: (value: number) => {
      node.rotateZ(degreesToRadians(value));
    },

    setPosition: (value: Vector3) => {
      position = Vector3.copy(value);

      node.position.set(position.x, position.y, position.z);
    },

    setRotation: (value: Vector3) => {
      rotation = Vector3.copy(value);

      node.rotation.set(
        degreesToRadians(rotation.x),
        degreesToRadians(rotation.y),
        degreesToRadians(rotation.z)
      );
    },

    setScale: (value: Vector3) => {
      scale = Vector3.copy(value);

      node.scale.set(scale.x, scale.y, scale.z);
    },
  };
};
