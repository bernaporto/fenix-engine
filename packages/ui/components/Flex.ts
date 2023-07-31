import {
  getClasses,
  getClassName,
  getDataAttributes,
  getTagName,
} from './tools';
import { FlexAttributes } from './types';
import { UIComponent } from './UIComponent';

const tagName = getTagName('flex');
const classes = getClasses(tagName, ['direction', 'justify', 'align']);
const dataAttributes = getDataAttributes(['spacing']);
const styles = `
.${getClassName([tagName])} {
  display: flex;
}

.${getClassName([tagName], 'row')} {
  flex-direction: row;
}

.${getClassName([tagName], 'column')} {
  flex-direction: column;
}

.${getClassName([tagName], 'justify-start')} {
  justify-content: flex-start;
}

.${getClassName([tagName], 'justify-center')} {
  justify-content: center;
}

.${getClassName([tagName], 'justify-end')} {
  justify-content: flex-end;
}

.${getClassName([tagName], 'align-start')} {
  align-items: flex-start;
}

.${getClassName([tagName], 'align-center')} {
  align-items: center;
}

.${getClassName([tagName], 'align-end')} {
  align-items: flex-end;
}
`;

export class Flex extends UIComponent {
  static readonly tagName = tagName;
  static readonly allowedAttributes: (keyof FlexAttributes)[] = [
    'direction',
    'justify',
    'align',
    'spacing',
  ];

  protected override defaultStyles = styles;
  protected override initialContext: FlexAttributes = {
    direction: 'row',
    justify: 'start',
    align: 'start',
    spacing: 0,
  };
  protected override baseTemplate = `
    <div class="${classes}" ${dataAttributes}>
      <slot></slot>
    </div>
  `;
}
