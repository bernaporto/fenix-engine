import type {
  AmbientLight,
  DirectionalLight,
  Object3D,
  PointLight,
} from 'three';
import { Mesh } from 'three';
import type { LightConfig, MeshUnitConfig } from '../@types';
import { Material } from './Material';

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
