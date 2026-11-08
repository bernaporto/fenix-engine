import { Loader } from '../Loader';
import { GameManifest, PrefabManifest, SceneManifest } from './Model';
import { isGameManifest, isPrefabManifest, isSceneManifest } from './utils';

const loadManifest =
  <T>(key: string, validate: (data: unknown) => data is T) =>
  async (path: string): Promise<T> => {
    try {
      const data = await Loader.loadJSON<T>(path);

      if (!validate(data)) {
        throw new Error(`File at path ${path} is not a valid ${key} manifest.`);
      }

      return data;
    } catch (error) {
      throw new Error(
        `Failed to load ${key} manifest file from path: ${path}`,
        { cause: error },
      );
    }
  };

export const loadGameManifest = loadManifest<GameManifest>(
  'game',
  isGameManifest,
);
export const loadSceneManifest = loadManifest<SceneManifest>(
  'scene',
  isSceneManifest,
);
export const loadPrefabManifest = loadManifest<PrefabManifest>(
  'prefab',
  isPrefabManifest,
);
