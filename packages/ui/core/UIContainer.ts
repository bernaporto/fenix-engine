import { randomCharacters } from '@fenix-engine/utilities/misc';
import { CONTAINER_KEY_ATTR } from '../constants';
import { sanitize } from '../tools';
import type { UIContainerConfig } from '../@types';
import { ContextRegistry, UIRegistry } from './registry';

export class UIContainer {
  private _element: HTMLElement;
  private _id = randomCharacters(12);

  constructor({ element, path, context }: UIContainerConfig) {
    const assetPromise = UIRegistry.get(path) ?? UIRegistry.add(path, path);
    assetPromise.then((rawData) => {
      element.innerHTML = sanitize(rawData);
    });

    element.setAttribute(CONTAINER_KEY_ATTR, this._id);
    ContextRegistry.add(this._id, context ?? {});

    this._element = element;
  }

  public unmount(): void {
    this._element.innerHTML = '';
    this._element.removeAttribute(CONTAINER_KEY_ATTR);
    ContextRegistry.remove(this._id);
  }
}
