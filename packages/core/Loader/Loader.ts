import type { AnimationClip, Group, Object3D } from 'three';
import type { SkinnedObject } from '../@types';
import { loadingManager } from './loadingManager';

type ProgressListener = (event: ProgressEvent<EventTarget>) => void;

export type LoaderWithLoad<T> = {
  load: (
    url: string,
    onLoad: (value: T) => void,
    onProgress?: ProgressListener,
    onError?: (event: ErrorEvent) => void
  ) => void;
};

type GltfObject = {
  animations: AnimationClip[];
  scene: Group;
};

type Loader = {
  loadXML(url: string, onProgress?: ProgressListener): Promise<string>;
  loadJSON<T>(url: string, onProgress?: ProgressListener): Promise<T>;
  loadObject(url: string, onProgress?: ProgressListener): Promise<Object3D>;
  loadSkinnedObject(
    url: string,
    onProgress?: ProgressListener
  ): Promise<SkinnedObject>;
};

const initLoader = (): Loader => {
  const cache = new Map<string, Promise<any>>();

  const load = <T>(url: string, onProgress?: ProgressListener): Promise<T> => {
    const cached = cache.get(url);

    if (cached) return cached;

    const promise = new Promise<T>((resolve, reject) => {
      const loader = loadingManager.getHandler(url);

      if (!loader || !isLoaderWithLoad(loader)) {
        throw new Error(`No loader found for ${url}`);
      }

      // @ts-ignore
      loader.load(url, resolve, onProgress, (error) => {
        console.error('Loader', url, error);
        reject(error);
      });
    });

    cache.set(url, promise);

    return promise;
  };

  return {
    loadXML: (...args) => load<string>(...args),
    loadJSON: (...args) => load<any>(...args).then(JSON.parse),
    loadObject: (...args) => load<Object3D>(...args),
    loadSkinnedObject: (...args) => load<GltfObject>(...args).then(unwrapGltf),
  };
};

const unwrapGltf = ({ scene, animations }: GltfObject): SkinnedObject => ({
  animations,
  root: scene,
});

export const Loader = initLoader();

// UTILS
const isLoaderWithLoad = <T>(loader: unknown): loader is LoaderWithLoad<T> =>
  loader !== null &&
  typeof loader === 'object' &&
  'load' in loader &&
  typeof loader.load === 'function';
