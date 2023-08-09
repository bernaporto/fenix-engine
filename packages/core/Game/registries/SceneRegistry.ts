import { makeRegistry } from '@fenix-engine/utilities/misc';
import type { SceneManifest } from '../../Data/Model';
import { loadSceneManifest } from '../../Data/manifest';

export const SceneRegistry = makeRegistry<
  { path: string },
  Promise<SceneManifest>
>({
  process: ({ path }) => loadSceneManifest(path),
});
