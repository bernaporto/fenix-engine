import { game } from '@fenix-engine/core';
// import { getLoadLevelFn } from './level/loadLevel';
import { hookKeyboardInput, hookMouseInput } from './input';
// import { loadGameConfig } from './utils/loadGameConfig';
import { store } from '../store';
import { registerBehaviours } from './behaviours/registerBehaviours';
import { getProperty } from './helpers';
import { Scene } from '@fenix-engine/core/Scene';

export const initGame = async (containerId: string) => {
  store.set('loopState', 'load');

  registerBehaviours();

  const { initialScene } = await game.init({
    containerId,
    manifest: 'assets/game.manifest',
  });

  const mouse = hookMouseInput(game.renderer.domElement);
  hookKeyboardInput();

  // TODO: create menu scene
  store.set('loopState', 'onMenu');

  // const loadLevel = getLoadLevelFn(app.stage, mouse);
  setupLevelProperties(await game.stage.load(initialScene ?? 'main'));

  store.set('loopState', 'onGame');
};

const setupLevelProperties = (scene: Scene) => {
  store.set('level.path', getProperty(scene, 'path'));
  store.set('level.totalHealth', getProperty(scene, 'totalHealth'));
};
