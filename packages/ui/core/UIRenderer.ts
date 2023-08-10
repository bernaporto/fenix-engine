import type { RenderUIConfig } from '../@types';
import { sanitize, stringToHtml } from '../utils';
import { UIBehaviourRegistry, UIRegistry } from './registries';
import { UIUnit } from './UIUnit';

export class UIRenderer {
  public readonly behaviours = {
    register: UIBehaviourRegistry.add,
  };

  public async render({
    path,
    context,
    container,
  }: RenderUIConfig): Promise<UIUnit> {
    const assetPromise = UIRegistry.get(path) ?? UIRegistry.add(path, path);
    const rawData = await assetPromise;

    const node = stringToHtml(sanitize(rawData));
    if (node === null) {
      throw new Error(`Failed to render UI from ${path}`);
    }

    const unit = new UIUnit({ node, context });
    if (container) {
      unit.setParent(container);
    }

    return unit;
  }
}
