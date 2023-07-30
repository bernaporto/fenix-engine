import { UIComponent } from './UIComponent';
import type { StackAttributes } from './types';

export class VerticalStack extends UIComponent {
  static readonly tagName = 'fnx-vstack';
  static readonly allowedAttributes: (keyof StackAttributes)[] = ['spacing'];

  constructor() {
    super();

    this._template.innerHTML = `
      <div class="fnx-vstack">
        <slot></slot>
      </div>
    `;
  }
}
