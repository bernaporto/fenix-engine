import type { RenderUIConfig } from '../@types';
import { sanitize, stringToHtml } from '../tools';
import { UIUnit } from '../units';
import { UIBehaviourRegistry, UIRegistry } from './registries';

export class UIRenderer {
  public readonly behaviours = {
    register: UIBehaviourRegistry.add,
  };

  public async render({ path, context }: RenderUIConfig): Promise<UIUnit> {
    const assetPromise = UIRegistry.get(path) ?? UIRegistry.add(path, path);
    const rawData = await assetPromise;

    const node = stringToHtml(sanitize(rawData));
    if (node === null) {
      throw new Error(`Failed to render UI from ${path}`);
    }

    return new UIUnit({ node, context });
  }
}
