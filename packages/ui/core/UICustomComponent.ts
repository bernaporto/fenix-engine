import { UI } from './UI';
import { UIUnit } from './UIUnit';
import { AttributeContext, getAttributeContext } from '../utils/context';
import { applyContextToTree } from './applyContext';

export class UICustomComponent<
  T extends Record<string, string>
> extends HTMLElement {
  protected _attributes: T;
  protected _context: AttributeContext<T>;
  protected _unit: UIUnit | null = null;
  protected _subscriptions = new Set<VoidFunction>();

  constructor(private componentPath: string, defaultAttributes: T) {
    super();

    this._attributes = {
      ...defaultAttributes,
      ...[...this.attributes].reduce((acc, attr) => {
        return {
          ...acc,
          [attr.name]: attr.value,
        };
      }, {}),
    };
    this._context = getAttributeContext<T>(this, defaultAttributes);
  }

  async connectedCallback() {
    const unit = await UI.render({
      path: this.componentPath,
      container: this,
      beforeRender: (unit) => {
        const unitEl = unit.getHtmlElement();
        if (unitEl) {
          applyContextToTree(unit.getHtmlElement()!, this._attributes);
        }
      },
    });

    this._unit = unit;
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    this._context[name]?.set(newValue as any);
  }

  disconnectCallback() {
    this._subscriptions.forEach((unsubscribe) => unsubscribe());
    this._subscriptions.clear();
    this._unit?.dispose();
  }
}
