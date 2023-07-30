import { UIComponent } from './UIComponent';

export class Icon extends UIComponent {
  public static readonly tagName = 'fnx-icon';

  constructor() {
    super();

    this._template.innerHTML = `
      <span class="fnx-icon">
        <slot></slot>
      </span>
    `;
  }
}
