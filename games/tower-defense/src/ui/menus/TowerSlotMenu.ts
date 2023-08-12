import { compareArrays } from '@fenix-engine/utilities/misc';
import { UI } from '@fenix-engine/ui';
import type { TowerData } from '@/types';
import { FloatingMenu } from '../components/FloatingMenu';
import type { IconButton } from '../components/IconButton';

export class TowerSlotMenu extends FloatingMenu {
  static override readonly tagName: string = 'tower-slot-menu';

  private _currentTowerButtons = new Map<string, IconButton>();

  setAvailableTowers(
    towers: TowerData[],
    handleClick: (tower: TowerData) => void
  ) {
    const { added, removed } = compareArrays(
      towers.map((t) => t.type),
      [...this._currentTowerButtons.keys()]
    );

    removed.forEach((type) => {
      const button = this._currentTowerButtons.get(type);
      if (button) {
        button.remove();
        this._currentTowerButtons.delete(type);
      }
    });

    towers.forEach(async (tower) => {
      if (!added.includes(tower.type)) return;

      if (this._currentTowerButtons.has(tower.type)) {
        return;
      }

      const unit = await UI.render({
        template: '<icon-button @click="handleClick"/>',
        context: {
          icon: tower.icon ?? '',
          label: tower.stats.cost,
          handleClick: () => handleClick(tower),
        },
      });

      this.appendChild(unit.getHtmlElement()!);
    });
  }
}
