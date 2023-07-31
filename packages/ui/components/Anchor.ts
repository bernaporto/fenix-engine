import { getClasses, getClassName, getTagName } from './tools';
import type { AnchorAttributes } from './types';
import { UIComponent } from './UIComponent';

const tagName = getTagName('anchor');
const styles = `
.${getClassName([tagName])} {
  position: absolute;
}

.${getClassName([tagName], 'top-left')} {
  top: 0;
  left: 0;
}

.${getClassName([tagName], 'top-center')} {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.${getClassName([tagName], 'top-right')} {
  top: 0;
  right: 0;
}

.${getClassName([tagName], 'bottom-left')} {
  bottom: 0;
  left: 0;
}

.${getClassName([tagName], 'bottom-center')} {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.${getClassName([tagName], 'bottom-right')} {
  bottom: 0;
  right: 0;
}

.${getClassName([tagName], 'left-center')} {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.${getClassName([tagName], 'center')} {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.${getClassName([tagName], 'right-center')} {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}`;

export class Anchor extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof AnchorAttributes)[] = ['preset'];

  protected override defaultStyles = styles;
  protected override initialContext: AnchorAttributes = {
    preset: 'top-left',
  };
  protected override baseTemplate = `
    <div class="${getClasses(tagName, ['preset'])}">
      <slot></slot>
    </div>
  `;
}
