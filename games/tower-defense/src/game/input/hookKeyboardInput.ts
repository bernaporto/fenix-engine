import { KeyboardHandler } from '@fenix-engine/services/Input';
import { store } from '@/store';

export const hookKeyboardInput = (): VoidFunction => {
  const keyboard = new KeyboardHandler({
    Escape: [
      {
        validate: KeyboardHandler.isKey('Escape'),
        execute: () => {
          const gameState = store.get('loopState');

          switch (gameState) {
            case 'onGame':
              store.set('loopState', 'onPause');
              break;

            case 'onPause':
              store.set('loopState', 'onGame');
              break;

            default:
              // do nothing
              break;
          }
        },
      },
    ],
  });

  return keyboard.destroy;
};
