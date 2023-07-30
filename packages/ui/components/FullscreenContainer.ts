import { UIComponent } from './UIComponent';

export class FullscreenContainer extends UIComponent {
  static readonly tagName = 'fnx-fullscreen-container';
  static readonly allowedAttributes: never[] = [];

  constructor() {
    super();

    this._template.innerHTML = `
      <div class="fnx-fullscreen-container">
        <slot></slot>
      </div>
    `;
  }
}
