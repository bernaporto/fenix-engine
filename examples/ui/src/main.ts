import { makeObservable } from '@fenix-engine/utilities/reactivity';
import { UI } from '@fenix-engine/ui';
import { MyCustomComponent } from './MyCustomComponent';
import '@fenix-engine/ui/styles.css';

const counterOb = makeObservable(0);
setInterval(() => {
  counterOb.set(counterOb.get() + 1);
}, 1000);

const visibilityOb = makeObservable(true);

UI.addComponent({
  component: MyCustomComponent,
  tagName: 'my-custom-component',
});

UI.render({
  path: 'assets/ui/main.html',
  container: document.body,

  context: {
    counter: counterOb.toReadable(),
    visibility: visibilityOb.toReadable(),
    title: 'Hello World!',
    toggleVisibility: () => {
      visibilityOb.set(!visibilityOb.get());
    },
  },
});
