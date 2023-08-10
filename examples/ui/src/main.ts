import { makeObservable, toReadonly } from '@fenix-engine/utilities/reactivity';
import { UI } from '@fenix-engine/ui';
import { MyCustomComponent } from './MyCustomComponent';
import '@fenix-engine/ui/styles.css';

const counterOb = makeObservable(0);
setInterval(() => {
  counterOb.set(counterOb.get() + 1);
}, 1000);

const visibilityOb = makeObservable(true);

UI.addComponent('my-custom-component', MyCustomComponent);

UI.render({
  path: 'assets/ui/main.html',
  container: document.body,

  context: {
    counter: toReadonly(counterOb),
    visibility: toReadonly(visibilityOb),
    title: 'Hello World!',
    toggleVisibility: () => {
      visibilityOb.set(!visibilityOb.get());
    },
  },
});
