import type { AnyContext } from '../@types';
import { ContextRegistry } from '../core';
import { applyContext, getAttributes, getContextKey } from './tools';

export interface UIComponent {
  readonly allowedAttributes: string[];
  readonly tagName: string;
}

export class UIComponent extends HTMLElement {
  protected _template = document.createElement('template');
  protected _context: AnyContext;
  protected _baseTemplate: string = '';

  constructor() {
    super();

    const contextKey = getContextKey(this);
    this._context = ContextRegistry.get(contextKey) ?? {};
  }

  public connectedCallback(): void {
    const attributes = getAttributes(this);

    // Apply context to the template
    this._template.innerHTML = applyContext(this._baseTemplate, {
      ...attributes,
      ...this._context,
    });

    // Apply context to the text nodes
    this.childNodes.forEach((child) => {
      if (child.nodeType !== Node.TEXT_NODE) return;

      child.textContent = applyContext(child.textContent ?? '', this._context);
    });

    // Mount the shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });
    const content = this._template.content.cloneNode(true);
    shadow.appendChild(content);
  }
}
