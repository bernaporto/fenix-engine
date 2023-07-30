import { makeRegistry } from '@fenix-engine/core/Game/registries/makeRegistry';
import { Loader } from '@fenix-engine/core/Loader/Loader';
import { AnyContext } from '../@types';

export const UIRegistry = makeRegistry<string, Promise<string>>({
  process: (key) => Loader.loadXML(key),
});

export const ContextRegistry = makeRegistry<AnyContext>();
