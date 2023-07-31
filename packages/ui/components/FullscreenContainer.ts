import { getClasses, getTagName } from './tools';
import { UIComponent } from './UIComponent';

const tagName = getTagName('fullscreen-container');

export class FullscreenContainer extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: never[] = [];

  protected override _baseTemplate = `
    <div class="${getClasses(tagName)}">
      <slot></slot>
    </div>
  `;
}
