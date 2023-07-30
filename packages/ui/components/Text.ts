import { UIComponent } from './UIComponent';

export class Text extends UIComponent {
  public static readonly tagName = 'fnx-text';

  constructor() {
    super();

    this._template.innerHTML = `
      <p>
        <slot></slot>
      </p>
    `;
  }
}
