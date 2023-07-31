import type { ButtonAttributes } from './types';
import { getAttrName, getClassName, getClasses, getTagName } from './tools';
import { UIComponent } from './UIComponent';

const tagName = getTagName('button');
const classes = getClasses(tagName, ['size', 'variant']);
const disabledAttr = getAttrName('disabled');
const onClickAttr = getAttrName('onclick');
const styles = `
.${getClassName([tagName])} {
  border: 1px solid #000;
  border-radius: 0.25rem;
  background-color: #fff;
  color: #000;
  font-weight: 500;
  cursor: pointer;
}

.${getClassName([tagName], 'small')} {
  padding: 0.25rem 0.5rem;
  font-size: var(--font-size-small);
}

.${getClassName([tagName], 'medium')} {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-medium);
}

.${getClassName([tagName], 'large')} {
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-large);
}

.${getClassName([tagName], 'xl')} {
  padding: 1rem 2rem;
  font-size: var(--font-size-xl);
}

.${getClassName([tagName], 'ghost')} {
  border: 1px solid transparent;
  background-color: transparent;
}

.${getClassName([tagName], 'rounded')} {
  border-radius: 1rem;
}
`;

export class Button extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof ButtonAttributes)[] = [
    'disabled',
    'onclick',
    'size',
    'variant',
  ];

  protected override defaultStyles = styles;
  protected override initialContext: ButtonAttributes = {
    size: 'medium',
    variant: 'default',
    disabled: false,
    onclick: () => {
      /* noop */
    },
  };
  protected override baseTemplate = `
    <button class="${classes}" disabled="{{${disabledAttr}}}" onclick="{{${onClickAttr}}}">
      <slot></slot>
    </button>
  `;
}
