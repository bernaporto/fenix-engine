import { game } from '@fenix-engine/core';
import Stats from 'stats.js';

export const setupStats = () => {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  game.events.on('beforeRender', () => stats.begin());
  game.events.on('afterRender', () => stats.end());
};
