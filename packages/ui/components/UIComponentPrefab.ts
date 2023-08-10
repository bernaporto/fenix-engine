import { UI } from '../core';

export class UIComponentPrefab extends HTMLElement {
  public static readonly tagName = 'fnx-component';

  connectedCallback() {
    const path = this.getAttribute('path');

    if (!path) {
      throw new Error('Prefab must have a path attribute');
    }

    UI.render({
      path,
      container: this.parentElement!,
    }).finally(() => {
      this.remove();
    });
  }
}

customElements.define(UIComponentPrefab.tagName, UIComponentPrefab);
