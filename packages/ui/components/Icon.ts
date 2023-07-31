import { getClasses, getTagName } from './tools';
import type { IconAttributes } from './types';
import { UIComponent } from './UIComponent';

const tagName = getTagName('icon');

export class Icon extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof IconAttributes)[] = [
    'path',
    'size',
  ];

  protected override baseTemplate = `
    <img class="${getClasses(tagName, ['size'])}" src="{{path}}"/>
  `;
}
