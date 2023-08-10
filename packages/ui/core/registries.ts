import { makeRegistry } from '@fenix-engine/utilities/misc';
import { Loader } from '@fenix-engine/core/Loader/Loader';

export const UIRegistry = makeRegistry<string, Promise<string>>({
  process: (key) => Loader.loadXML(key),
});
