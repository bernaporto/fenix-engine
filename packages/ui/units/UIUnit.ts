import { EventEmitter } from 'eventemitter3';
import { randomCharacters } from '@fenix-engine/utilities/misc';
import type {
  CustomEvent,
  EventHandler,
} from '@fenix-engine/utilities/events/types';
import { makeEventHandler } from '@fenix-engine/utilities/events';
import type { AnyContext, UIUnitConfig } from '../@types';

type UIUnitEvent = 'click' | 'dispose' | 'load';

export class UIUnit {
  public readonly id: string;
  public readonly name: string;
  public readonly events: EventHandler<UIUnitEvent, CustomEvent>;

  protected _children = new Set<UIUnit>();
  protected _context: AnyContext;
  protected _emitter = new EventEmitter();
  protected _node: HTMLElement | ChildNode;
  protected _parent: UIUnit | null = null;

  constructor(props: UIUnitConfig) {
    const { node, context = {} } = props;

    this._node = node;
    const element = this.getHtmlElement();

    this._context = context;
    this.id = element?.getAttribute('id') ?? randomCharacters(12);
    this.events = makeEventHandler(this._emitter);
    this.name = `UIUnit-${this.id}`;
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

  public get node(): HTMLElement | ChildNode {
    return this._node;
  }

  public get parent(): UIUnit | null {
    return this._parent;
  }

  /* SETTERS */
  public setParent(parent: UIUnit | null): void {
    this._parent?.remove(this);
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
  }

  /* EVENTS */
  protected _emitEvent(event: UIUnitEvent, ...args: any[]): void {
    this._emitter.emit(event, ...args);
  }
}
