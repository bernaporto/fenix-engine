import { KeyboardHandler } from '@fenix-engine/services/Input';
import { store } from '@/store';
import { Ticker } from '@fenix-engine/core/Tools/Ticker';

export const hookKeyboardInput = (): VoidFunction => {
  const keyboard = new KeyboardHandler({
    Escape: [
      {
        validate: KeyboardHandler.isKey('Escape'),
        execute: () => {
          store.set('gameplay.selected', null);
          const gameState = store.get('loopState');

          switch (gameState) {
            case 'inGame':
              store.set('loopState', 'paused');
              Ticker.setStatus('paused');
              break;

            case 'paused':
              store.set('loopState', 'inGame');
              Ticker.setStatus('running');
              break;
          }
        },
      },
    ],
  });

  return keyboard.destroy;
};
