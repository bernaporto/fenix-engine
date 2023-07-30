import { components } from '../components';

export const registerComponents = () => {
  components.forEach((Component) => {
    customElements.define(Component.tagName, Component);
  });
};
