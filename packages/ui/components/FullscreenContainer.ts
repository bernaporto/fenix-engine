import { UIComponent } from './UIComponent';

export class FullscreenContainer extends UIComponent {
  public static readonly tagName = 'fnx-fullscreen-container';

  constructor() {
    super();

    this._template.innerHTML = `
      <div class="fnx-fullscreen-container">
        <slot></slot>
      </div>
    `;
  }
}
