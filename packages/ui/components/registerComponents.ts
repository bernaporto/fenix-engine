import { Button } from './Button';

export const registerComponents = () => {
  [Button].forEach((Component) => {
    customElements.define(Component.tagName, Component);
  });
};
