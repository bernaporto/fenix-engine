import { DATA_ID_ATTR } from '../constants';
import type { AnyContext, RenderUIConfig } from '../@types';
import { sanitize, stringToHtml } from '../utils';
import { UIRegistry } from './registries';
import { UIUnit } from './UIUnit';

export class UIRenderer {
  private _units = new Map<string, UIUnit>();
  private _customComponents = new Set<string>();

  public async render({
    path,
    context,
    container,
  }: RenderUIConfig): Promise<UIUnit> {
    const rawData = await (UIRegistry.get(path) ?? UIRegistry.add(path, path));

    const node = stringToHtml(sanitize(rawData, [...this._customComponents]));
    if (node === null) {
      throw new Error(`Failed to render UI from ${path}`);
    }

    const unit = new UIUnit({
      node,
      context: context ?? this.tryGetRootContext(container),
    });

    if (container) {
      unit.setParent(container);
    }

    this._units.set(unit.id, unit);
    unit.events.once('dispose', () => this._units.delete(unit.id));

    return unit;
  }

  /**
   * This is designed to be used when rendering a UIUnit inside another UIUnit.
   */
  private tryGetRootContext(node?: ChildNode): AnyContext {
    if (!node) return {};

    const rootUnit = this.tryToFindRootUnit(node);

    return rootUnit?.context ?? {};
  }

  private tryToFindRootUnit(node: ChildNode): UIUnit | null {
    // 1. Check if the node is a UIUnit
    const getUnitByNode = (node: ChildNode): UIUnit | null => {
      if (node instanceof HTMLElement) {
        const unitId = node.getAttribute(DATA_ID_ATTR);

        return (unitId !== null && this._units.get(unitId)) || null;
      }

      return null;
    };

    // 2. Check if the node is a child of a UIUnit
    const getUnitByChildNode = (node: ChildNode): UIUnit | null => {
      const parent = node.parentElement;

      if (parent) {
        return getUnitByNode(parent) ?? getUnitByChildNode(parent);
      }

      return null;
    };

    return getUnitByNode(node) ?? getUnitByChildNode(node);
  }

  public addComponent(tagName: string, component: typeof HTMLElement) {
    customElements.define(tagName, component);
    this._customComponents.add(tagName);
  }
}
