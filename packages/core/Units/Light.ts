import { AmbientLight, DirectionalLight, PointLight } from 'three';
import { Unit } from './Unit';
import type { LightConfig } from '../types';

export class Light extends Unit {
  private _light: AmbientLight | DirectionalLight | PointLight;

  constructor(config?: LightConfig) {
    super(config);

    const light = createLight(config);
    light.castShadow = config?.castShadow ?? false;

    this._light = light;
    this.node.add(light);
  }

  get light(): AmbientLight | DirectionalLight | PointLight {
    return this._light;
  }
}

const createLight = (
  config?: LightConfig
): AmbientLight | DirectionalLight | PointLight => {
  const { color, decay, distance, intensity, lightType }: LightConfig = {
    ...{
      color: '#ffffff',
      decay: 2,
      distance: 0,
      intensity: 1,
      lightType: 'point',
    },
    ...config,
  };

  switch (lightType) {
    case 'ambient':
      return new AmbientLight(color, intensity);
    case 'directional':
      return new DirectionalLight(color, intensity);
    case 'point':
      return new PointLight(color, intensity, distance, decay);
  }
};
