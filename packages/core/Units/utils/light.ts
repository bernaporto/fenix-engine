import type { AmbientLight, DirectionalLight, PointLight } from 'three';
import type { LightConfig } from '../../@types';
import { Vector3 } from '../../Math';

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
