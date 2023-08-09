import { makeRegistry } from '@fenix-engine/utilities/misc';
import { Loader } from '@fenix-engine/core/Loader/Loader';
import { UIBehaviour } from '../@types';

export const UIBehaviourRegistry = makeRegistry<UIBehaviour>();

export const UIRegistry = makeRegistry<string, Promise<string>>({
  process: (key) => Loader.loadXML(key),
});
