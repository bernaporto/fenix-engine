import { UI } from '@fenix-engine/ui';
import { components } from './components';

export { loadUI } from './loadUI';

components.forEach((Component) => {
  UI.addComponent({
    attributes: Component.allowedAttributes,
    component: Component,
    tagName: Component.tagName,
  });
});
