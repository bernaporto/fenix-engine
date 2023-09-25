import { randomCharacters } from '@fenix-engine/utilities/misc';
import type {
  CustomEvent,
  PublicEventHandler,
} from '@fenix-engine/utilities/events/types';
import {
  makeEventEmitter,
  makePublicEventHandler,
} from '@fenix-engine/utilities/events';
import type { VoidFunction } from '@fenix-engine/utilities/@types';
import type { AnyContext, UIUnitConfig } from '../@types';
import { DATA_ID_ATTR } from '../constants';
import { setupLifecycleHandler } from '../utils';
import { applyContextToTree } from './applyContext';

type UIUnitEvent = 'dispose';

export class UIUnit {
  public readonly id = randomCharacters(12);
  public readonly name: string;
  public readonly events: PublicEventHandler<UIUnitEvent, CustomEvent>;
  public readonly context: AnyContext;

  protected _children = new Set<UIUnit>();
  protected _emitter = makeEventEmitter();
  protected _node: HTMLElement | ChildNode;
  protected _parent: UIUnit | null = null;

  constructor(props: UIUnitConfig) {
    const { node, context } = props;

    this.context = context;
    this._node = node;
    const element = this.getHtmlElement();
    element?.setAttribute(DATA_ID_ATTR, this.id);

    this.events = makePublicEventHandler(this._emitter);
    this.name = `UIUnit-${this.id}`;

    let usubscribeContext: null | VoidFunction = null;
    const usubscribeLifecycle = setupLifecycleHandler({
      id: this.id,
      onAttach: () => {
        usubscribeContext = applyContextToTree(node, context);
      },
      onDetach: () => {
        usubscribeContext?.();
        usubscribeLifecycle();
      },
    });
  }

  public getHtmlElement(): HTMLElement | null {
    if (this._node instanceof HTMLElement) {
      return this._node;
    }
    return null;
  }

  /* GETTERS */
  public get children(): UIUnit[] {
    return [...this._children];
  }

  public get parent(): UIUnit | null {
    return this._parent;
  }

  /* SETTERS */
  public setParent(parent: HTMLElement | UIUnit | null): void {
    this._parent?.remove(this);

    const element = this.getHtmlElement();

    if (parent instanceof HTMLElement) {
      this._parent = null;

      if (element) {
        parent.appendChild(element);
      }

      return;
    }

    this._parent = parent;
    parent?.append(this);
  }

  /* HIERARCHY */
  public append(child: UIUnit): void {
    this._children.add(child);
    child._parent = this;

    const childElement = child.getHtmlElement();
    const element = this.getHtmlElement();

    if (childElement && element) {
      element.appendChild(childElement);
    }
  }

  public remove(child: UIUnit): void {
    this._children.delete(child);
    child.setParent(null);

    const childElement = child.getHtmlElement();
    const element = this.getHtmlElement();

    if (childElement && element) {
      element.removeChild(childElement);
    }
  }

  public dispose(): void {
    this._children.forEach((child) => child.dispose());
    this._children.clear();
    this.setParent(null);

    this._emitEvent('dispose');
    this._emitter.clear();
  }

  /* EVENTS */
  protected _emitEvent(event: UIUnitEvent, ...args: any[]): void {
    this._emitter.emit(event, ...args);
  }
}
