import type { Object3D } from 'three';
import { makeRegistry } from './makeRegistry';
import { Loader } from '../../Loader';
import { SkinnedObject } from '../../types';

export const PropAssetRegistry = makeRegistry<string, Promise<Object3D>>({
  process: (path) => Loader.loadObject(path),
});

export const PuppetAssetRegistry = makeRegistry<string, Promise<SkinnedObject>>(
  {
    process: (path) => Loader.loadSkinnedObject(path),
  }
);
