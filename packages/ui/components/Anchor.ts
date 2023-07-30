import { UIComponent } from './UIComponent';
import { AnchorAttributes } from './types';

export class Anchor extends UIComponent {
  static readonly tagName = 'fnx-anchor';
  static readonly allowedAttributes: (keyof AnchorAttributes)[] = [
    'preset',
    'top',
    'left',
    'bottom',
    'right',
  ];

  constructor() {
    super();

    this._template.innerHTML = `
      <a>
        <slot></slot>
      </a>
    `;
  }
}
