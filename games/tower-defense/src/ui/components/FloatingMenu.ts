import type { Vector2 } from '@fenix-engine/core/Math';

enum Classes {
  ROOT = 'floating-menu',
  ITEMS = 'floating-menu__items',
  VISIBLE = 'floating-menu__items--visible',
  HIDDEN = 'floating-menu__items--hidden',
}

export class FloatingMenu extends HTMLElement {
  static readonly tagName: string = 'floating-menu';
  static readonly allowedAttributes: string[] = [];

  private _itemsNode = document.createElement('div');

  connectedCallback() {
    this.classList.add(Classes.ROOT);

    this._itemsNode.classList.add(Classes.ITEMS);
    [...(this.children ?? [])].forEach((child) => {
      this._itemsNode.appendChild(child);
    });
    this.appendChild(this._itemsNode);
    this.appendChild = this._appendChildOverride.bind(this);

    this.updateChildrenPostion();
    this.setPosition({ x: -1000, y: -1000 });
    this.hide();
  }

  show(position: Vector2) {
    this.setVisibility(true);
    this.setPosition(position);
  }

  hide() {
    this.setVisibility(false);
  }

  private _appendChildOverride<T extends Node>(node: T): T {
    const result = this._itemsNode.appendChild(node);
    this.updateChildrenPostion();

    return result;
  }

  protected setVisibility(visible: boolean) {
    this._itemsNode.classList.remove(Classes.HIDDEN);
    this._itemsNode.classList.remove(Classes.VISIBLE);
    this._itemsNode.classList.add(visible ? Classes.VISIBLE : Classes.HIDDEN);
  }

  protected setPosition(position: Vector2) {
    const { width, height } = this.getBoundingClientRect();
    const computedPos = {
      x: position.x - width / 2,
      y: position.y - height / 2,
    };

    // SET MENU POSITION
    this.style.left = `${computedPos.x}px`;
    this.style.top = `${computedPos.y}px`;
  }

  private updateChildrenPostion() {
    const items = this._itemsNode.children ?? [];

    // SET MENU ITEMS POSITION IN A CIRCLE
    [...items].forEach((child, index, arr) => {
      if (!child || !(child instanceof HTMLElement)) return;

      const count = arr.length;
      const radius = 6.8; // 4.6rem is the radius of the circle;

      child.style.position = 'absolute';
      child.style.transform = `translate(${
        radius * Math.cos(-0.5 * Math.PI - 2 * (1 / count) * index * Math.PI)
      }rem, ${
        radius * Math.sin(-0.5 * Math.PI - 2 * (1 / count) * index * Math.PI)
      }rem)`;
    });
  }
}
