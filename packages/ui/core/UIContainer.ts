import { sanitize } from '../components';
import type { UIContainerConfig } from '../@types';
import { ContextRegistry, UIRegistry } from './registry';

export class UIContainer {
  private _element: HTMLElement;

  constructor({ element, path, context }: UIContainerConfig) {
    this._element = element;

    ContextRegistry.add(path, context ?? {});
    const assetPromise = UIRegistry.get(path) ?? UIRegistry.add(path, path);

    assetPromise.then((rawData) => {
      const cleanData = sanitize(rawData);
      element.innerHTML = cleanData;
    });
  }

  public unmount(): void {
    this._element.innerHTML = '';
  }
}
