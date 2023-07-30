import { UIComponent } from './UIComponent';
import type { StackAttributes } from './types';

export class HorizontalStack extends UIComponent {
  static readonly tagName = 'fnx-hstack';
  static readonly allowedAttributes: (keyof StackAttributes)[] = ['spacing'];

  constructor() {
    super();

    this._template.innerHTML = `
      <div class="fnx-hstack">
        <slot></slot>
      </div>
    `;
  }
}
