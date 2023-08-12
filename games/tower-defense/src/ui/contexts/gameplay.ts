import { getLoopStateManager } from '@/tools/getGameStateManager';
import { pipe, all } from '@fenix-engine/utilities/reactivity/operators';
import { UI } from '@fenix-engine/ui';
import { UIUnit } from '@fenix-engine/ui/core';
import { Vector2 } from '@fenix-engine/core/Math';
import type { ContextHandler, GameState, TowerType } from '@/types';
import { store } from '@/store';
import { handlePurchase } from '../helpers/handlePurchase';
import type { TowerSlotMenu } from '../menus/TowerSlotMenu';

export const loadGameplayUI = async (path: string, container: HTMLElement) => {
  const stateManager = getLoopStateManager(['inGame', 'paused']);
  const unit = await UI.render({
    path,
    container,
    context: getGameplayContext(),
  });

  let currentMenu: FloatingMenuController | null = null;
  const handleFloatingMenu = (selected: GameState['gameplay']['selected']) => {
    if (currentMenu) {
      currentMenu.hide();
      currentMenu = null;
    }

    if (selected === null) return;

    const getMenu =
      selected.type === 'empty' ? getTowerSlotMenuManager : getTowerMenuManager;

    getMenu(unit).then((menu) => {
      menu.show(selected.position);
      currentMenu = menu;
    });
  };

  stateManager.onceDone(
    store.subscribe('gameplay.selected', handleFloatingMenu),
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

type FloatingMenuController = {
  show: (position: Vector2) => void;
  hide: () => void;
};

const getTowerMenuManager = async (
  root: UIUnit
): Promise<FloatingMenuController> => {
  const unit = await UI.render({
    template: '<tower-slot-menu></tower-slot-menu>',
  });
  root.append(unit);

  return unit.getHtmlElement()! as TowerSlotMenu;
};

const getTowerSlotMenuManager = async (
  root: UIUnit
): Promise<FloatingMenuController> => {
  const unit = await UI.render({
    template: '<tower-slot-menu></tower-slot-menu>',
  });
  root.append(unit);

  const menu = unit.getHtmlElement()! as TowerSlotMenu;
  // TODO: retrive tower data from store
  menu.setAvailableTowers(
    [
      {
        name: 'Watch Tower',
        type: 'watch',
        description:
          'Classic tower, from the castle walls, with a vertical opening that shoots arrows.',
        icon: 'assets/ui/icons/arrow.png',
        stats: {
          range: 4,
          cooldown: 1,
          cost: 10,
          projectile: {
            damage: 1,
            initialAngle: 0,
            speed: 6,
            startPosition: {
              x: 0,
              y: 0.75,
              z: 0,
            },
            targetOffset: {
              x: 0,
              y: 0.125,
              z: 0,
            },
          },
        },
        upgrades: [
          {
            'projectile.critical.damage': 3,
          },
          {
            'projectile.critical.chance': 10,
          },
          {
            'projectile.critical.chance': 20,
          },
          {
            'projectile.critical.chance': 30,
          },
        ],
      },
    ],
    handlePurchase
  );

  return unit.getHtmlElement()! as TowerSlotMenu;
};
