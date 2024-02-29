import '@fenix-engine/ui/styles.css';
import { observable, readable } from '@fenix-engine/utilities/reactivity';
import { UI } from '@fenix-engine/ui';
import { MyCustomComponent } from './MyCustomComponent';

const counterOb = observable(0);
setInterval(() => {
  counterOb.set(counterOb.get() + 1);
}, 1000);

const visibilityOb = observable(true);

UI.addComponent({
  component: MyCustomComponent,
  tagName: 'my-custom-component',
});

UI.render({
  path: 'assets/ui/main.html',
  container: document.body,

  context: {
    counter: readable(counterOb),
    visibility: readable(visibilityOb),
    title: 'Hello World!',
    toggleVisibility: () => {
      visibilityOb.set(!visibilityOb.get());
    },
  },
});
