import { UIComponent } from './UIComponent';
import type { IconAttributes } from './types';

export class Icon extends UIComponent {
  static readonly tagName = 'fnx-icon';
  static readonly allowedAttributes: (keyof IconAttributes)[] = [
    'path',
    'size',
  ];

  constructor() {
    super();

    this._template.innerHTML = `
      <span class="fnx-icon">
        <slot></slot>
      </span>
    `;
  }
}
