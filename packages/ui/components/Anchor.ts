import { getClasses, getTagName } from './tools';
import type { AnchorAttributes } from './types';
import { UIComponent } from './UIComponent';

const tagName = getTagName('anchor');

export class Anchor extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof AnchorAttributes)[] = ['preset'];

  protected override _baseTemplate = `
    <div class="${getClasses(tagName, ['preset'])}">
      <slot></slot>
    </div>
  `;
}
