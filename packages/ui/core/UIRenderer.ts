import { DATA_ID_ATTR } from '../constants';
import type { AnyContext, RenderUIConfig } from '../@types';
import { ensureHtmlExtension, sanitize, stringToHtml } from '../utils';
import { applyContextToElement } from './applyContext';
import { UICustomComponent } from './UICustomComponent';
import { UIRegistry } from './registries';
import { UIUnit } from './UIUnit';

type CustomComponentConfig = {
  tagName: string;
  component: typeof UICustomComponent<any> | typeof HTMLElement;
  attributes?: string[];
};

export class UIRenderer {
  private _units = new Map<string, UIUnit>();
  private _customComponents = new Map<
    string,
    Omit<CustomComponentConfig, 'component'>
  >();

  public async render({
    context,
    container,
    beforeRender,
    ...config
  }: RenderUIConfig): Promise<UIUnit> {
    const rawData =
      'path' in config ? await this.getFromPath(config.path) : config.template;

    const [customComponents, customAttributes] =
      this.getComponentsAndAttributes();
    const node = stringToHtml(
      sanitize(rawData, customComponents, customAttributes)
    );
    if (node === null) {
      throw new Error(
        `Failed to render UI from ${
          'path' in config ? config.path : config.template
        }`
      );
    }

    const unit = new UIUnit({
      node,
      context: context ?? this.tryGetRootContext(container),
    });

    beforeRender?.(unit);
    container && unit.setParent(container);

    this._units.set(unit.id, unit);
    unit.events.once('dispose', () => this._units.delete(unit.id));

    return unit;
  }

  private getFromPath(path: string): Promise<string> {
    const htmlPath = ensureHtmlExtension(path);

    return UIRegistry.get(htmlPath) ?? UIRegistry.add(htmlPath, htmlPath);
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

  public addComponent({
    tagName,
    component,
    attributes = [],
  }: CustomComponentConfig) {
    customElements.define(tagName, component);
    this._customComponents.set(tagName, { tagName, attributes });
  }

  private getComponentsAndAttributes(): [string[], Record<string, string[]>] {
    const componentEntries = Array.from(this._customComponents.values());

    const customComponents = componentEntries.map(({ tagName }) => tagName);
    const customAttributes = componentEntries.reduce<Record<string, string[]>>(
      (acc, { tagName, attributes }) => {
        acc[tagName] = attributes ?? [];

        return acc;
      },
      {}
    );

    return [customComponents, customAttributes];
  }

  public applyContext(node: HTMLElement, context: AnyContext) {
    applyContextToElement(node, context);
  }
}
