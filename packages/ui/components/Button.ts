import { UIComponent } from './UIComponent';

export class Button extends UIComponent {
  public static readonly tagName = 'fnx-button';

  constructor() {
    super();

    this._template.innerHTML = `
      <button>
        <slot></slot>
      </button>
    `;
  }
}
