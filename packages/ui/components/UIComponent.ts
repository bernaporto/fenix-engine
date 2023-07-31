import { setOnPath } from '@fenix-engine/utilities/store/utils';
import type { AnyContext } from '../@types';
import { ContextRegistry } from '../core';
import {
  applyContext,
  getAttributes,
  getContextKey,
  getContextKeys,
  getTextContent,
  isReadonlyObservable,
} from './tools';
import { applyStyles } from '../tools/style';

export class UIComponent extends HTMLElement {
  protected baseTemplate: string = '';
  protected defaultStyles: string = '';
  protected initialContext: AnyContext = {};

  private _context: AnyContext = {};
  private _originalContent: string = '';
  private _shadow = this.attachShadow({ mode: 'open' });
  private _subscriptions = new Set<VoidFunction>();
  private _template = document.createElement('template');

  constructor() {
    super();

    this._originalContent = this.innerHTML;
  }

  /* Initialize context */
  private initContext(context: AnyContext): void {
    const updateContext = (key: string, value: unknown) => {
      setOnPath(this._context, key, value);
    };

    const workingContext = { ...this.initialContext, ...context };
    const usedKeys = [
      ...getContextKeys(this.baseTemplate),
      ...getContextKeys(getTextContent(this)),
    ];

    Object.entries(workingContext).forEach(([key, value]) => {
      if (!usedKeys.includes(key)) return;

      if (!isReadonlyObservable(value)) {
        updateContext(key, value);

        return;
      }

      this._subscriptions.add(
        value.subscribe((newValue: unknown) => {
          updateContext(key, newValue);
          this.build();
        })
      );

      updateContext(key, value.get());
    });
  }

  /* Lifecylce methods */
  public connectedCallback(): void {
    const contextKey = getContextKey(this);
    this.initContext(ContextRegistry.get(contextKey) ?? {});

    this.build();
  }

  public disconnectedCallback(): void {
    this.resetContent();
    this._subscriptions.forEach((unsubscribe) => unsubscribe());
    this._subscriptions.clear();
  }

  /* Build methods */
  private build(): void {
    // Reset the component
    this.resetContent();

    const attributes = getAttributes(this);

    // Apply context to the template
    this._template.innerHTML = applyContext(this.baseTemplate, {
      ...attributes,
      ...this._context,
    });

    // Apply context to the text nodes
    this.childNodes.forEach((child) => {
      if (child.nodeType !== Node.TEXT_NODE) return;

      child.textContent = applyContext(child.textContent ?? '', this._context);
    });

    // Mount the shadow DOM
    const content = this._template.content.cloneNode(true);
    this._shadow.appendChild(content);

    // Apply styles
    if (this.defaultStyles) {
      applyStyles(this._shadow, this.defaultStyles);
    }
  }

  private resetContent(): void {
    this.innerHTML = this._originalContent;
    this._shadow.innerHTML = '';
    this._template.innerHTML = '';
  }
}
