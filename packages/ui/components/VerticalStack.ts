import { getClasses, getTagName } from './tools';
import type { StackAttributes } from './types';
import { UIComponent } from './UIComponent';

const tagName = getTagName('vstack');

export class VerticalStack extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof StackAttributes)[] = ['spacing'];

  protected override _baseTemplate = `
    <div class="${getClasses(tagName, ['spacing'])}">
      <slot></slot>
    </div>
  `;
}
