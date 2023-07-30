import { game } from '@fenix-engine/core';
import { ui } from '@fenix-engine/ui';
import { radiansToDegrees } from '@fenix-engine/utilities/misc';
import { createStore } from '@fenix-engine/utilities/store';

const store = createStore({
  gameStatus: 'playing',
  angle: 0,
  coins: 100,
});

game.behaviours.register('orbit', (unit) => ({
  onUpdate: ({ deltaTime }) => {
    unit.transform.rotateY(15 * deltaTime);
    store.set('angle', radiansToDegrees(unit.transform.rotation.y));
  },
}));

game.init({
  containerId: 'game',
  manifest: 'assets/manifest.json',
});

ui.render(
  {
    containerId: 'ui',
    path: 'assets/ui/main.html',
  },
  {
    angle: store.getReadable('angle'),
    coins: {
      icon: 'assets/ui/icons/coin.png',
      value: store.getReadable('coins'),
    },
    status: store.getReadable('gameStatus'),

    onClickButton: () => console.log('button clicked'),
  }
);
