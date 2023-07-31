import { getClasses, getTagName } from './tools';
import type { TextAttributes } from './types';
import { UIComponent } from './UIComponent';

const tagName = getTagName('text');

export class Text extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof TextAttributes)[] = ['size'];

  protected override _baseTemplate = `
  <div class="${getClasses(tagName, ['size'])}">
    <slot></slot>
  </div>
  `;
}
