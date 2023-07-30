import { UIComponent } from './UIComponent';

export class VerticalStack extends UIComponent {
  public static readonly tagName = 'fnx-vstack';

  constructor() {
    super();

    this._template.innerHTML = `
      <div class="fnx-vstack">
        <slot></slot>
      </div>
    `;
  }
}
