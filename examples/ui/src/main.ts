import { makeObservable, toReadonly } from '@fenix-engine/utilities/reactivity';
import { UI } from '@fenix-engine/ui';
import '@fenix-engine/ui/styles.css';

const counterOb = makeObservable(0);
const counterVisibilityOb = makeObservable(true);
setInterval(() => {
  counterOb.set(counterOb.get() + 1);
}, 1000);

UI.render({
  path: 'assets/ui/main.html',
  container: document.body,
  context: {
    counter: toReadonly(counterOb),
    visibility: toReadonly(counterVisibilityOb),
    title: 'Hello World!',
    toggleVisibility: () => {
      const visibility = counterVisibilityOb.get();
      counterVisibilityOb.set(!visibility);
    },
  },
});
