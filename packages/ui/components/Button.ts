import { UIComponent } from './UIComponent';
import { ButtonAttributes } from './types';

export class Button extends UIComponent {
  static readonly tagName = 'fnx-button';
  static readonly allowedAttributes: (keyof ButtonAttributes)[] = [
    'disabled',
    'onClick',
    'size',
    'variant',
  ];

  constructor() {
    super();

    this._template.innerHTML = `
      <button>
        <slot></slot>
      </button>
    `;
  }
}
