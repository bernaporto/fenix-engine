import { getClasses, getTagName } from './tools';
import type { BoxAttributes } from './types';
import { UIComponent } from './UIComponent';

const tagName = getTagName('container');

export class Container extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof BoxAttributes)[] = ['bg'];

  protected override baseTemplate = `
    <div class="${getClasses(tagName)}">
      <slot></slot>
    </div>
  `;
}
