import type { Behaviour } from '@fenix-engine/core/@types';
import type { MouseHandler } from '@fenix-engine/services/Input';
import { getCanvas, getCurrentCamera } from '@/game/helpers';
import { store } from '@/store';
import { Constants } from '@/constants';
import { Vector2, Vector3 } from '@fenix-engine/core/Math';

export const interactable =
  (mouse: MouseHandler): Behaviour =>
  (unit) => {
    const canvas = getCanvas();
    const camera = getCurrentCamera();

    const unsubscribe = mouse.state.subscribe((state) => {
      if (state.type === 'click') {
        const hits = new Set(camera.raycast(state.normalizedPosition, unit));

        const selected = [...hits].pop();

        if (!selected) {
          store.set('gameplay.selected', null);
          return;
        }

        const key = Vector3.toString(selected.transform.position);
        const type = store.get(`gameplay.towerSlots.${key}`);
        const position = Vector2.add(
          camera.worldToScreen(selected?.transform.position, canvas),
          Constants.MENU_OFFSET
        );

        store.set('gameplay.selected', { key, type, position });
      }
    });

    return {
      onDetach: unsubscribe,
    };
  };
