import { UIComponent } from './UIComponent';

export class Button extends UIComponent {
  public static readonly tagName = 'fnx-button';

  constructor() {
    super();

    this.build();
  }

  protected override build(): void {
    this.innerHTML = `
      <button>
        <slot></slot>
      </button>
    `;
  }
}
