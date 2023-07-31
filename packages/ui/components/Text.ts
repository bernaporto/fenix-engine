import { getClasses, getClassName, getTagName } from './tools';
import type { TextAttributes } from './types';
import { UIComponent } from './UIComponent';

const tagName = getTagName('text');
const styles = `
.${getClassName([tagName], 'small')} {
  font-size: var(--font-size-small);
}

.${getClassName([tagName], 'medium')} {
  font-size: var(--font-size-medium);
}

.${getClassName([tagName], 'large')} {
  font-size: var(--font-size-large);
}

.${getClassName([tagName], 'xl')} {
  font-size: var(--font-size-xl);
}

.${getClassName([tagName], 'light')} {
  font-weight: 300;
}

.${getClassName([tagName], 'regular')} {
  font-weight: 400;
}

.${getClassName([tagName], 'bold')} {
  font-weight: 'bold';
}

.${getClassName([tagName], 'black')} {
  font-weight: 900;
}
`;

export class Text extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof TextAttributes)[] = [
    'size',
    'weight',
  ];

  protected override defaultStyles = styles;
  protected override initialContext: TextAttributes = {
    size: 'medium',
    weight: 'regular',
  };
  protected override baseTemplate = `
  <div class="${getClasses(tagName, ['size', 'weight'])}">
    <slot></slot>
  </div>
  `;
}
