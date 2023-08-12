import { UICustomComponent } from '@fenix-engine/ui/core';

type ButtonAttributes = {
  icon: string;
  label: string;
  disabled?: string;
};

const defaultAttributes: ButtonAttributes = {
  icon: '{{icon}}',
  label: '{{label}}',
};

export class IconButton extends UICustomComponent<ButtonAttributes> {
  static readonly tagName = 'icon-button';
  static readonly allowedAttributes: (keyof ButtonAttributes)[] = [
    'icon',
    'label',
    'disabled',
  ];

  constructor() {
    super('assets/ui/components/icon-button', defaultAttributes);
  }
}
