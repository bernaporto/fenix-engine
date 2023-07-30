export interface UIComponent {
  readonly tagName: string;
}

export class UIComponent extends HTMLElement {
  protected _template = document.createElement('template');

  constructor() {
    super();

    // this.attachShadow({ mode: 'open' });
    this.build();
  }

  protected cloneTemplate(): Node {
    return this._template.content.cloneNode(true);
  }

  protected build(): void {
    this.appendChild(this.cloneTemplate());
  }

  public connectedCallback(): void {
    console.log('connectedCallback');
  }

  public disconnectedCallback(): void {
    console.log('disconnectedCallback');
  }

  public attributeChangedCallback(): void {
    console.log('adoptedCallback');
  }
}
