import { Material } from '../../Units';
import type { MaterialConfig } from '../../@types/config';
import { makeRegistry } from './makeRegistry';

export const MaterialRegistry = makeRegistry({
  process: (model: MaterialConfig) => new Material(model),
});
