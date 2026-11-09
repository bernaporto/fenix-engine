import type { Game } from '@fenix-engine/core';
import { Camera } from '@fenix-engine/core/Units';
import type { Cell } from './board';
import { cellToWorld } from './boardView';

export function registerBoardBehaviours(
  game: Game,
  reducedMotion: MediaQueryList,
): void {
  game.behaviours.register('grid-movement', (unit) => ({
    onUpdate: ({ deltaTime }) => {
      const target = unit.properties.get<Cell>('destination');
      if (!target) throw new Error(`Missing destination for ${unit.name}`);

      const destination = cellToWorld(target, 0.4);
      const current = unit.transform.position;
      const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-16 * deltaTime);
      const distance = Math.hypot(
        destination.x - current.x,
        destination.z - current.z,
      );

      unit.transform.setPosition(
        distance < 0.005
          ? destination
          : {
              x: current.x + (destination.x - current.x) * blend,
              y: destination.y,
              z: current.z + (destination.z - current.z) * blend,
            },
      );
    },
  }));
  game.behaviours.register('selection-pulse', (unit) => ({
    onUpdate: ({ elapsedTime }) => {
      const scale = reducedMotion.matches
        ? 1
        : 1 + Math.sin(elapsedTime * 4) * 0.04;
      unit.transform.setScale({ x: scale, y: 1, z: scale });
    },
  }));
  game.behaviours.register('fit-board-camera', (unit) => {
    if (!(unit instanceof Camera)) {
      throw new Error('The fit-board-camera behaviour requires a camera unit.');
    }

    const fitZoom = (aspect: number): void => {
      unit.setZoom(Math.min(20 / 8.5, (20 * aspect) / 8.5));
    };
    const unsubscribe = game.stage.events.on('resize', ({ aspect }) => {
      fitZoom(aspect);
    });

    const size = game.stage.size;
    if (size) fitZoom(size.aspect);

    return { onDetach: unsubscribe };
  });
}
