import type { Object3D } from 'three';
import { makeRegistry } from '@fenix-engine/utilities/misc';
import { Loader } from '../../Loader';
import { loadPrefabManifest } from '../../Data/manifest';
import type { PrefabManifest } from '../../Data/Model';
import type { PrefabConfig, SkinnedObject } from '../../@types';

export const PropAssetRegistry = makeRegistry<string, Promise<Object3D>>({
  process: (path) => Loader.loadObject(path),
});

export const PuppetAssetRegistry = makeRegistry<string, Promise<SkinnedObject>>(
  {
    process: (path) => Loader.loadSkinnedObject(path),
  },
);

export const PrefabAssetRegistry = makeRegistry<
  PrefabConfig,
  Promise<PrefabManifest>
>({
  process: async ({ path }) => loadPrefabManifest(path),
});
