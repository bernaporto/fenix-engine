import '@fenix-engine/ui/styles.css';

import type { AnyContext } from '@fenix-engine/ui/@types';
import { all, pipe } from '@fenix-engine/utilities/reactivity/operators';
import { UI } from '@fenix-engine/ui';
import { store } from '@/store';

export const loadUI = (path: string) => {
  const container = document.body;
  const context = getContext(path);

  UI.render({
    path,
    container,
    context,
  });
};

/* CONTEXTS */
type ContextHandler = () => AnyContext;

/* Gameplay */
const getGameplayContext: ContextHandler = () => {
  const waveValueOb = pipe(
    all(
      store.getReadable('gameplay.stats.currentWave'),
      store.getReadable('level.totalWaves')
    ),
    ([currentWave, totalWaves]) => `${currentWave}/${totalWaves}`
  );

  const btnNextVisible = pipe(
    store.getReadable('gameplay.stats.waveStatus'),
    (value: string) => value === 'idle'
  );

  const context = {
    loopState: store.getReadable('loopState'),
    onClickRestart: () => {
      // TODO: implement full game loop
      window.location.reload();
    },

    waveStats: {
      value: waveValueOb,
    },

    playerStats: {
      defense: store.getReadable('gameplay.stats.defense'),
      coins: store.getReadable('gameplay.stats.coins'),
    },

    btnNext: {
      visible: btnNextVisible,
      onClick: () => {
        store.set('gameplay.stats.waveStatus', 'running');
      },
    },
  };

  return context;
};

/* UTILS */
const contextHandlerMap = {
  gameplay: getGameplayContext,
};

const getContext = (path: string) => {
  const entry = Object.entries(contextHandlerMap).find(([key, _]) =>
    path.includes(key)
  );

  const handler = entry?.[1];

  return handler?.() ?? {};
};
