import { getLoopStateManager } from '@/tools/getGameStateManager';
import { pipe, all } from '@fenix-engine/utilities/reactivity/operators';
import { UI } from '@fenix-engine/ui';
import type { ContextHandler } from '@/types';
import { store } from '@/store';
import { handleFloatingMenu } from './handleFloatingMenu';

export const loadGameplayUI = async (path: string, container: HTMLElement) => {
  const stateManager = getLoopStateManager(['inGame', 'paused']);
  const unit = await UI.render({
    path,
    container,
    context: getGameplayContext(),
  });

  stateManager.onceDone(
    store.subscribe('gameplay.selected', handleFloatingMenu(unit)),
    unit.dispose.bind(unit)
  );
};

const getGameplayContext: ContextHandler = () => {
  return {
    loopState: store.getReadable('loopState'),
    onClickRestart: () => {
      // TODO: implement full game loop
      location.reload();
    },

    btnNext: {
      visible: pipe(
        store.getReadable('gameplay.stats.waveStatus'),
        (value: string) => value === 'idle'
      ),
      onClick: () => {
        store.set('gameplay.stats.waveStatus', 'running');
      },
    },

    playerStats: {
      defense: store.getReadable('gameplay.stats.defense'),
      coins: store.getReadable('gameplay.stats.coins'),
    },

    waveStats: {
      value: pipe(
        all(
          store.getReadable('gameplay.stats.currentWave'),
          store.getReadable('level.totalWaves')
        ),
        ([currentWave, totalWaves]) => `${currentWave}/${totalWaves}`
      ),
    },
  };
};
