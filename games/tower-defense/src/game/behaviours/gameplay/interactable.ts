import type { Behaviour } from '@fenix-engine/core/@types';
import type { MouseHandler } from '@fenix-engine/services/Input';
import { getCurrentCamera } from '@/game/helpers';
import { store } from '@/store';

export const interactable =
  (mouse: MouseHandler): Behaviour =>
  (unit) => {
    const camera = getCurrentCamera();

    const unsubscribe = mouse.state.subscribe((state) => {
      if (state.type === 'click') {
        const hits = new Set(camera.raycast(state.normalizedPosition, unit));

        const selected = [...hits].pop() ?? null;
        store.set(
          'gameplay.selected',
          selected
            ? {
                // TODO: This is temporary. We need to get the type of the tower.
                type: 'empty',
                position: selected.transform.position,
              }
            : null
        );
      }
    });

    return {
      onDetach: unsubscribe,
    };
  };
