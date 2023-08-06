import { makeObservable, toReadonly } from '@fenix-engine/utilities/reactivity';
import { UI } from '@fenix-engine/ui';

const counterOb = makeObservable(0);
setInterval(() => counterOb.set(counterOb.get() + 1), 1000);

UI.render(
  {
    containerId: 'ui',
    path: 'assets/ui/main.html',
  },
  {
    counter: toReadonly(counterOb),
    onClickButton: () => console.log('button clicked'),
  }
);
