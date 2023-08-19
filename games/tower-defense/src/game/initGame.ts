import { game } from '@fenix-engine/core';
import { store } from '@/store';
import { hookGameLifecycleEvents } from './helpers/lifecycle';
import { hookKeyboardInput, hookMouseInput } from './input';
import { loadLevel } from './utils/loadLevel';
import { registerBehaviours } from './behaviours/registerBehaviours';
import { Ticker } from '@fenix-engine/core/Tools/Ticker';
import { loadConfig } from './loadConfig';

export const initGame = async (containerId: string) => {
  store.set('loopState', 'load');

  setupRootElement(containerId);

  const mouse = hookMouseInput(game.renderer.domElement);
  hookKeyboardInput();
  hookGameLifecycleEvents();

  registerBehaviours(mouse);

  await loadConfig();

  const { initialScene } = await game.init({
    containerId,
    manifest: 'assets/game.manifest',
  });

  // TODO: create menu scene...
  store.set('loopState', 'inMenu');

  // ...to allow players to start the game
  loadLevel(initialScene ?? 'main');
};

const setupRootElement = (rootId: string) => {
  const root = document.getElementById(rootId);
  if (!root) {
    throw new Error(`Could not find root element with id ${rootId}`);
  }
  const attrName = 'data-ticker-status';

  Ticker.state.subscribe(({ status }) => {
    const currValue = root.getAttribute(attrName);
    if (currValue === status) return;

    root.setAttribute(attrName, status);
  });
};
