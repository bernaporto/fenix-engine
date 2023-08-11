import { UICustomComponent } from '@fenix-engine/ui/core';

type IconBadgeAttributes = {
  icon: string;
  value: string;
  size: string;
  width: string;
};

const defaultAttributes: IconBadgeAttributes = {
  size: '2.4rem',
  width: '8rem',
  icon: '',
  value: '',
};

export class IconBadge extends UICustomComponent<IconBadgeAttributes> {
  static readonly tagName = 'icon-badge';
  static readonly allowedAttributes: (keyof IconBadgeAttributes)[] = [
    'icon',
    'value',
    'size',
    'width',
  ];

  constructor() {
    super(defaultAttributes);
  }

  static get observedAttributes() {
    return IconBadge.allowedAttributes;
  }

  override async connectedCallback() {
    await super.connectedCallback();

    // ICON
    const iconEl = this.getElementsByTagName('img')[0];
    const iconOb = this._context.icon;
    const sizeOb = this._context.size;
    if (iconEl) {
      const applyIcon = (value: string) => {
        iconEl.src = value;
      };
      const applyIconSize = (value: string) => {
        iconEl.style.setProperty('width', value);
        iconEl.style.setProperty('height', value);
      };
      applyIcon(iconOb.get());
      this._subscriptions.add(iconOb.subscribe(applyIcon));
      applyIconSize(sizeOb.get());
      this._subscriptions.add(sizeOb.subscribe(applyIconSize));
    }

    // VALUE
    const valueEl = this.getElementsByTagName('span')[0];
    const valueOb = this._context.value;
    if (valueEl) {
      const applyValue = (value: string) => {
        valueEl.textContent = value;
      };
      applyValue(valueOb.get());
      this._subscriptions.add(valueOb.subscribe(applyValue));
    }

    // WIDTH
    const rootEl = this.getElementsByTagName('section')[0];
    const widthOb = this._context.width;
    if (rootEl) {
      const applyWidth = (value: string) => {
        rootEl.style.setProperty('width', value);
      };
      applyWidth(widthOb.get());
      this._subscriptions.add(widthOb.subscribe(applyWidth));
    }
  }
}
