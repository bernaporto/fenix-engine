import { AmbientLight, DirectionalLight, PointLight } from 'three';
import type { LightConfig } from '../@types';
import { applyLightConfig } from './utils';
import { Unit } from './Unit';

export class Light extends Unit {
  private _light: AmbientLight | DirectionalLight | PointLight;

  constructor(config?: LightConfig) {
    super(config);

    const { lightType, ...lightConfig }: LightConfig = {
      color: '#ffffff',
      decay: 2,
      distance: 0,
      intensity: 1,
      lightType: 'point',
      type: 'light',
      ...config,
    };

    const light = createLight(lightType);
    this._light = light;

    this.setConfig(lightConfig);

    this.node.add(light);
  }

  get light(): AmbientLight | DirectionalLight | PointLight {
    return this._light;
  }

  setConfig(config: LightConfig): void {
    applyLightConfig(this._light, config);
  }
}

/* UTILS */
const constructorMap = {
  ambient: AmbientLight,
  directional: DirectionalLight,
  point: PointLight,
};

const createLight = (
  lightType: LightConfig['lightType'] = 'point'
): AmbientLight | DirectionalLight | PointLight =>
  new constructorMap[lightType]();
