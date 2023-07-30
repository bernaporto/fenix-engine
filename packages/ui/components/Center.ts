import { UIComponent } from './UIComponent';

export class Center extends UIComponent {
  public static readonly tagName = 'fnx-center';

  constructor() {
    super();

    this._template.innerHTML = `
      <div class="fnx-center">
        <slot></slot>
      </div>
    `;
  }
}
