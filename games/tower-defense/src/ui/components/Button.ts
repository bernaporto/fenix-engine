import { UICustomComponent } from '@fenix-engine/ui/core';

type ButtonAttributes = {
  label: string;
  disabled?: string;
};

const defaultAttributes: ButtonAttributes = {
  label: 'Click me!',
};

export class Button extends UICustomComponent<ButtonAttributes> {
  static readonly tagName = 'game-button';
  static readonly allowedAttributes: (keyof ButtonAttributes)[] = [
    'label',
    'disabled',
  ];

  constructor() {
    super('assets/ui/components/game-button', defaultAttributes);
  }
}
