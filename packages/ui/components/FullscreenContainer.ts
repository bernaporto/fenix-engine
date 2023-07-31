import { getClasses, getClassName, getTagName } from './tools';
import { UIComponent } from './UIComponent';

const tagName = getTagName('fullscreen-container');
const styles = `
.${getClassName([tagName])} {
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}`;

export class FullscreenContainer extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: never[] = [];

  protected override defaultStyles = styles;
  protected override baseTemplate = `
    <div class="${getClasses(tagName)}">
      <slot></slot>
    </div>
  `;
}
