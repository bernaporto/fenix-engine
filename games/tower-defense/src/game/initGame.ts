import { game } from '@fenix-engine/core';
// import { getLoadLevelFn } from './level/loadLevel';
import { hookKeyboardInput, hookMouseInput } from './input';
// import { loadGameConfig } from './utils/loadGameConfig';
import { store } from '../store';
import { registerBehaviours } from './behaviours/registerBehaviours';
import { loadLevel } from './utils/loadLevel';

export const initGame = async (containerId: string) => {
  store.set('loopState', 'load');

  const mouse = hookMouseInput(game.renderer.domElement);
  hookKeyboardInput();

  registerBehaviours(mouse);

  const { initialScene } = await game.init({
    containerId,
    manifest: 'assets/game.manifest',
  });

  // TODO: create menu scene
  store.set('loopState', 'onMenu');

  // const loadLevel = getLoadLevelFn(app.stage, mouse);
  loadLevel(initialScene ?? 'main');
};
