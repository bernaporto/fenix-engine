import { getClasses, getTagName } from './tools';
import { UIComponent } from './UIComponent';

const tagName = getTagName('center');

export class Center extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: never[] = [];

  protected override _baseTemplate = `
    <div class="${getClasses(tagName)}">
      <slot></slot>
    </div>
  `;
}
