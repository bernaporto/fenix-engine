export interface UIComponent {
  readonly tagName: string;
}

export class UIComponent extends HTMLElement {
  constructor() {
    super();
  }

  protected build(): void {
    throw new Error('Method not implemented.');
  }
}
