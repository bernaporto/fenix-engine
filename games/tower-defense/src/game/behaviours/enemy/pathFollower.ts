import { Behaviour } from '@fenix-engine/core/@types';
import { PathFollower } from '@fenix-engine/services/Path';
import { Vector3 } from '@fenix-engine/core/Math';
import { Constants } from '@/constants';
import { getProperty } from '@/game/helpers';
import { store } from '@/store';

export const pathFollower: Behaviour = (unit) => {
  const path = store.get('level.path') as Vector3[];
  const speed = getProperty<number>(unit, 'speed');

  const pathFollower = new PathFollower({
    path,
    speed: speed * Constants.ENEMY_SPEED_MULTIPLIER,
  });

  return {
    onUpdate: ({ deltaTime }) => {
      const { done, nextNodePos, position, travelledDistance } =
        pathFollower.getNextPosition(deltaTime, unit.transform.position);

      unit.transform.setPosition(position);
      unit.transform.lookAt(nextNodePos);

      pathFollower.setTravelledDistance(travelledDistance);

      if (done) {
        unit.dispose();
      }
    },
  };
};
