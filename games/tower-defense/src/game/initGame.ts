import { game } from '@fenix-engine/core';
import { store } from '@/store';
import { hookGameLifecycleEvents } from './helpers/lifecycle';
import { hookKeyboardInput, hookMouseInput } from './input';
import { loadLevel } from './utils/loadLevel';
import { registerBehaviours } from './behaviours/registerBehaviours';

export const initGame = async (containerId: string) => {
  store.set('loopState', 'load');

  const mouse = hookMouseInput(game.renderer.domElement);
  hookKeyboardInput();
  hookGameLifecycleEvents();

  registerBehaviours(mouse);

  const { initialScene } = await game.init({
    containerId,
    manifest: 'assets/game.manifest',
  });

  // TODO: create menu scene...
  store.set('loopState', 'inMenu');

  // ...to allow players to start the game
  loadLevel(initialScene ?? 'main');
};
