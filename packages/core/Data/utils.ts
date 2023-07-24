import { isValidObject } from '@fenix-engine/shared/utils';
import { GameManifest, SceneManifest } from './Model';

export const isGameManifest = (data: unknown): data is GameManifest =>
  isValidObject(data) && 'scenes' in data;

export const isSceneManifest = (data: unknown): data is SceneManifest =>
  isValidObject(data) && 'key' in data && 'tree' in data;
