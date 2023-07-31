import type { ButtonAttributes } from './types';
import { getClasses, getTagName } from './tools';
import { UIComponent } from './UIComponent';

const tagName = getTagName('button');

export class Button extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof ButtonAttributes)[] = [
    'disabled',
    'onClick',
    'size',
    'variant',
  ];

  protected override _baseTemplate = `
    <button class="${getClasses(tagName, [
      'size',
      'variant',
    ])}" disabled="{{disabled}}" onclick={{onClick}}>
      <slot></slot>
    </button>
  `;
}
