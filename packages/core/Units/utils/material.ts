import type { Texture } from 'three';
import { Material as THREE_Material, RawShaderMaterial } from 'three';
import { Loader } from '../../Loader';
import type { MaterialAssetConfig, MeshUnitConfig } from '../../@types';
import { Material } from '../Material';

export const getMaterial = (
  materialConfig: MeshUnitConfig['material'],
): Material | null | undefined => {
  if (!materialConfig) return;

  return materialConfig instanceof Material
    ? materialConfig
    : Material.load(materialConfig);
};

export const loadMaterialAssets = async (
  material: THREE_Material,
  config?: MaterialAssetConfig,
) => {
  if (!config) return;
  if (material instanceof RawShaderMaterial) return;

  const entries = (
    await Promise.all(
      Object.entries(config).map<Promise<[string, Texture | null]>>(
        async ([key, value]) => {
          try {
            const texture = await Loader.loadTexture(value);

            return [key, texture];
          } catch {
            console.error('Failed to load texture', value);

            return [key, null];
          }
        },
      ),
    )
  ).filter(([, texture]) => texture !== null) as [string, Texture][];

  entries.forEach(([key, texture]) => {
    if (texture) {
      (material as unknown as Record<string, unknown>)[key] = texture;
    }
  });

  if (entries.length > 0) {
    material.needsUpdate = true;
  }
};
