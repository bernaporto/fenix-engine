import { UI } from '@fenix-engine/ui';
import { UIUnit } from '@fenix-engine/ui/core/UIUnit';
import { AttributeContext, getAttributeContext } from '../utils/context';

export class UICustomComponent<
  T extends Record<string, string>
> extends HTMLElement {
  protected _context: AttributeContext<T>;
  protected _unit: UIUnit | null = null;
  protected _subscriptions = new Set<VoidFunction>();

  constructor(defaultAttributes: T) {
    super();

    this._context = getAttributeContext<T>(this, defaultAttributes);
  }

  async connectedCallback() {
    const unit = await UI.render({
      path: 'assets/ui/components/icon-badge',
    });

    this._unit = unit;
    unit.setParent(this);
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
