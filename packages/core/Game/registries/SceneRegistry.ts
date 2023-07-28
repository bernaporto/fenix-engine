import type { SceneManifest } from '../../Data/Model';
import { loadSceneManifest } from '../../Data/manifest';
import { makeRegistry } from './makeRegistry';

export const SceneRegistry = makeRegistry<
  { path: string },
  Promise<SceneManifest>
>({
  process: ({ path }) => loadSceneManifest(path),
});
