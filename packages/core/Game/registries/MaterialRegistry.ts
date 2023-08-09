import { makeRegistry } from '@fenix-engine/utilities/misc';
import { Material } from '../../Units';
import type { MaterialConfig } from '../../@types/config';

export const MaterialRegistry = makeRegistry({
  process: (model: MaterialConfig) => new Material(model),
});
