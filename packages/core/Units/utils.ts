import type {
  AmbientLight,
  DirectionalLight,
  Object3D,
  OrthographicCamera,
  PointLight,
} from 'three';
import { Mesh, PerspectiveCamera } from 'three';
import {
  clone,
  getFromPath,
  setOnPath,
} from '@fenix-engine/utilities/store/utils';
import type { LightConfig, MeshUnitConfig } from '../@types';
import { Material } from './Material';
import { Vector3 } from '../Math';
import { Unit } from '.';

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

  const applyConfig = (child: Object3D) => {
    if (isMesh(child)) {
      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;

      const material = getMaterial(materialConfig);

      if (material === null) {
        throw new Error(`Material "${materialConfig}" not found`);
      }

      material && (child.material = material.build());
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
    target,
  }: LightConfig = {
    castShadow: false,
    color: '#ffffff',
    decay: 2,
    distance: 0,
    intensity: 1,
    shadowMapWidth: 512,
    shadowMapHeight: 512,
    target: Vector3.zero,
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

  if ('target' in light) {
    light.target.position.set(target.x, target.y, target.z);
    light.target.updateMatrixWorld();
  }
};

/* CAMERA UTILS */
export const resizeCamera = (
  camera: OrthographicCamera | PerspectiveCamera,
  aspect: number,
  viewSize = 20
) => {
  if (camera instanceof PerspectiveCamera) {
    resizePerspectiveCamera(camera, aspect);
  } else {
    resizeOrthographicCamera(camera, aspect, viewSize);
  }
};

const resizePerspectiveCamera = (camera: PerspectiveCamera, aspect: number) => {
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
};

const resizeOrthographicCamera = (
  camera: OrthographicCamera,
  aspect: number,
  viewSize: number
) => {
  camera.left = (-aspect * viewSize) / 2;
  camera.right = (aspect * viewSize) / 2;
  camera.top = viewSize / 2;
  camera.bottom = -viewSize / 2;
  camera.updateProjectionMatrix();
};

/* PROPERTY UTILS */
export type PropertiesHandler = {
  setState: (properties: Record<string, any>) => void;
  get: <T = unknown>(path: string) => T;
  set: (path: string, value: unknown) => void;
};

export const getPropertiesHandler = (
  properties: Record<string, any>
): PropertiesHandler => {
  const store = clone(properties);

  return {
    setState: (newProperties) => {
      Object.assign(store, clone(newProperties));
    },

    get: (path) => {
      return getFromPath(clone(store), path);
    },

    set: (path, value) => {
      setOnPath(store, path, clone(value));
    },
  };
};

/* MISC UTILS */
export const assignUnitToNode = (unit: Unit) => {
  unit.node.userData.unit = unit;
};

export const findNodeUnit = (node: Object3D): Unit | null => {
  if (node.userData.unit) {
    return node.userData.unit;
  }

  if (node.parent) {
    return findNodeUnit(node.parent);
  }

  return null;
};
