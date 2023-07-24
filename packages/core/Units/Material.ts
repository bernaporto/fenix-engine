import {
  Material as THREE_Material,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type MeshBasicMaterialParameters,
  type MeshStandardMaterialParameters,
} from 'three';

type MaterialConfig =
  | ({
      type: 'basic';
    } & MeshBasicMaterialParameters)
  | ({
      type: 'standard';
    } & MeshStandardMaterialParameters);

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
}
