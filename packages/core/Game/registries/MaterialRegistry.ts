import { MaterialModel } from '../../Data/Model';
import { Material } from '../../Units';
import { makeRegistry } from './makeRegistry';

export const MaterialRegistry = makeRegistry({
  process: (model: MaterialModel) => new Material(model),
});
