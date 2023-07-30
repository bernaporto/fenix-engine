import { UIComponent } from './UIComponent';

export class HorizontalStack extends UIComponent {
  public static readonly tagName = 'fnx-hstack';

  constructor() {
    super();

    this._template.innerHTML = `
      <div class="fnx-hstack">
        <slot></slot>
      </div>
    `;
  }
}
