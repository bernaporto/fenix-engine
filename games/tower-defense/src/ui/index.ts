import { UI } from '@fenix-engine/ui';
import { components } from './components';
import { menus } from './menus';

export { loadUI } from './loadUI';

[...components, ...menus].forEach((Component) => {
  UI.addComponent({
    attributes: Component.allowedAttributes,
    component: Component,
    tagName: Component.tagName,
  });
});
