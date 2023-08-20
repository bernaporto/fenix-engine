import { UI, type UIUnit } from '@fenix-engine/ui/core';
import { Vector2 } from '@fenix-engine/core/Math';
import type { GameState } from '@/types';
import { handlePurchase } from '../../helpers/handlePurchase';
import type { TowerSlotMenu } from '../../menus/TowerSlotMenu';
import { store } from '@/store';

let currentMenu: FloatingMenuController | null = null;
export const handleFloatingMenu =
  (unit: UIUnit) => (selected: GameState['gameplay']['selected']) => {
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
  menu.setAvailableTowers(
    store
      .get('level.availableTowers')
      .map((key) => store.get(`config.towers.${key}`)),
    handlePurchase
  );

  return unit.getHtmlElement()! as TowerSlotMenu;
};
