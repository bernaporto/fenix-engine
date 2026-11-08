import { AmbientLight, DirectionalLight, PointLight } from 'three';
import type { LightConfig } from '../@types';
import { UnitRegistry } from '../Game/registries/UnitRegistry';
import { applyLightConfig, resizeCamera } from './utils';
import { Unit } from './Unit';

class Light extends Unit {
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

    this.resize(1);
  }

  // TODO: Resize shadow camera on window resize
  public resize(aspect: number) {
    if (!this._light.castShadow || !this._light.shadow) return;

    resizeCamera(this._light.shadow.camera, aspect, 40);
  }
}

UnitRegistry.add('light', Light);
export { Light };

/* UTILS */
const constructorMap = {
  ambient: AmbientLight,
  directional: DirectionalLight,
  point: PointLight,
};

const createLight = (
  lightType: LightConfig['lightType'] = 'point',
): AmbientLight | DirectionalLight | PointLight =>
  new constructorMap[lightType]();
