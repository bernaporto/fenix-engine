import { Game } from '@fenix-engine/core';

(async function init() {
  const game = new Game({
    manifest: '/assets/manifest.json',
    container: document.getElementById('game')!,
    backgroundColor: 0x242424,
  });

  await game.load();

  game.stage.load('basic-scene');
})();
