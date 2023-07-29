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
            case 'inGame':
              store.set('loopState', 'paused');
              break;

            case 'paused':
              store.set('loopState', 'inGame');
              break;
          }
        },
      },
    ],
  });

  return keyboard.destroy;
};
