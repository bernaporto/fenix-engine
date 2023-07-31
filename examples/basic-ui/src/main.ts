import { makeObservable, toReadonly } from '@fenix-engine/utilities/reactivity';
import { ui } from '@fenix-engine/ui';

const counterOb = makeObservable(0);

ui.render(
  {
    containerId: 'ui',
    path: 'assets/ui/main.html',
  },
  {
    counter: toReadonly(counterOb),
  }
);
