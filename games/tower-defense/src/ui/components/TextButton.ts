import { UICustomComponent } from '@fenix-engine/ui/core';

type ButtonAttributes = {
  label: string;
  disabled?: string;
};

const defaultAttributes: ButtonAttributes = {
  label: 'Click me!',
};

export class TextButton extends UICustomComponent<ButtonAttributes> {
  static readonly tagName = 'text-button';
  static readonly allowedAttributes: (keyof ButtonAttributes)[] = [
    'label',
    'disabled',
  ];

  constructor() {
    super('assets/ui/components/text-button', defaultAttributes);
  }
}
