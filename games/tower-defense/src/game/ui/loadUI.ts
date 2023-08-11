import '@fenix-engine/ui/styles.css';

import type { AnyContext } from '@fenix-engine/ui/@types';
import { makeObservable } from '@fenix-engine/utilities/reactivity';
import { UI } from '@fenix-engine/ui';
import { store } from '@/store';

export const loadUI = async (path: string) => {
  const container = document.body;
  const [context, unsubscribe] = getContext(path);

  const ui = await UI.render({
    path,
    container,
    context,
  });

  ui.events.once('dispose', unsubscribe);
};

/* CONTEXTS */
type ContextHandler = () => [AnyContext, VoidFunction];

/* Gameplay */
const getGameplayContext: ContextHandler = () => {
  const visibilityOb = makeObservable(true);
  const waveValueOb = makeObservable('');
  const subscriptions = new Set<VoidFunction>();

  subscriptions.add(
    store.subscribe('gameplay.stats.waveStatus', (newValue) => {
      if (newValue === 'idle') {
        visibilityOb.set(true);
      }
    })
  );

  subscriptions.add(
    store.subscribe('gameplay.stats.currentWave', (newValue) => {
      const totalWaves = store.get('level.totalWaves');
      waveValueOb.set(`${newValue}/${totalWaves}`);
    })
  );

  subscriptions.add(
    store.subscribe('level.totalWaves', (newValue) => {
      const currentWave = store.get('gameplay.stats.currentWave');
      waveValueOb.set(`${currentWave}/${newValue}`);
    })
  );

  const context = {
    waveStats: {
      value: waveValueOb.toReadonly(),
    },

    playerStats: {
      defense: store.getReadable('gameplay.stats.defense'),
      coins: store.getReadable('gameplay.stats.coins'),
    },

    btnNext: {
      visible: visibilityOb.toReadonly(),
      onClick: () => {
        store.set('gameplay.stats.waveStatus', 'running');
        visibilityOb.set(false);
      },
    },
  };

  const unsubscribe = () =>
    subscriptions.forEach((unsubscribe) => unsubscribe());

  return [context, unsubscribe];
};

/* UTILS */
const contextHandlerMap = {
  gameplay: getGameplayContext,
};
const noop = () => {
  /* noop */
};

const getContext = (path: string) => {
  const entry = Object.entries(contextHandlerMap).find(([key, _]) =>
    path.includes(key)
  );

  const handler = entry?.[1];

  return handler?.() ?? [{}, noop];
};
