import { UICustomComponent } from '@fenix-engine/ui/core';

type IconBadgeAttributes = {
  icon: string;
  iconSize: string;
  value: string;
  width: string;
};

const defaultAttributes: IconBadgeAttributes = {
  iconSize: '2.4rem',
  width: '8rem',
  icon: '',
  value: '',
};

export class IconBadge extends UICustomComponent<IconBadgeAttributes> {
  static readonly tagName = 'icon-badge';
  static readonly allowedAttributes: (keyof IconBadgeAttributes)[] = [
    'icon',
    'value',
    'iconSize',
    'width',
  ];

  constructor() {
    super('assets/ui/components/icon-badge', defaultAttributes);
  }

  override async connectedCallback() {
    await super.connectedCallback();

    // ICON
    const iconEl = this.getElementsByTagName('img')[0];
    const iconSizeOb = this._context.iconSize;
    if (iconEl) {
      const applyIconSize = (value: string) => {
        iconEl.style.setProperty('width', value);
        iconEl.style.setProperty('height', value);
      };
      applyIconSize(iconSizeOb.get());
      this._subscriptions.add(iconSizeOb.subscribe(applyIconSize));
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
