import { UIComponent } from './UIComponent';

export class Anchor extends UIComponent {
  public static readonly tagName = 'fnx-anchor';

  constructor() {
    super();

    this._template.innerHTML = `
      <a>
        <slot></slot>
      </a>
    `;
  }
}
