import {
  Material as THREE_Material,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from 'three';
import { MaterialConfig } from '../@types';
import { MaterialRegistry } from '../Game/registries';

const materialConstructorMap = {
  basic: MeshBasicMaterial,
  standard: MeshStandardMaterial,
};

/**
 * A Material is a wrapper around a Three.js Material.
 * The goal of this class is to provide a consistent interface for the developer,
 * without exposing the underlying Three.js API.
 */
export class Material {
  private _material: THREE_Material | null = null;

  constructor(private config?: MaterialConfig) {}

  build() {
    const { type, ...params } = this.config ?? { type: 'basic' };
    const Material = materialConstructorMap[type];

    if (!this._material) {
      this._material = new Material(params);
    }

    return this._material;
  }

  static load(keyOrModel: string | MaterialConfig) {
    if (typeof keyOrModel === 'string') {
      return MaterialRegistry.get(keyOrModel);
    }

    if (keyOrModel.key !== undefined) {
      return MaterialRegistry.get(keyOrModel.key);
    }

    return new Material(keyOrModel);
  }
}
