import { UIComponent } from './UIComponent';
import type { TextAttributes } from './types';

export class Text extends UIComponent {
  static readonly tagName = 'fnx-text';
  static readonly allowedAttributes: (keyof TextAttributes)[] = ['size'];

  constructor() {
    super();

    this._template.innerHTML = `
      <p>
        <slot></slot>
      </p>
    `;
  }

  public connectedCallback(): void {
    console.log('connectedCallback', getAttributes(this));
  }
}

const getAttributes = (element: HTMLElement): Record<string, string> => {
  const attributes = element.attributes;

  return Array.from(attributes).reduce((acc, attr) => {
    acc[attr.name] = attr.value;

    return acc;
  }, {} as Record<string, string>);
};
