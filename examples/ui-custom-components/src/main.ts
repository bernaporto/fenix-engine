import { UI } from '@fenix-engine/ui';
import { createStore } from '@fenix-engine/utilities/store';

const store = createStore({
  gameStatus: 'playing',
  angle: 0,
  coins: 100,
});

UI.render(
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
