import { Behaviour } from '@fenix-engine/core/@types';
import { PathFollower } from '@fenix-engine/services/Path';
import { Vector3 } from '@fenix-engine/core/Math';
import { EnemyData } from '@/types';
import { store } from '@/store';
import { getProperty } from '../helpers';

export const pathFollower: Behaviour = (unit) => {
  const path = store.get('level.path') as Vector3[];
  const stats = getProperty<EnemyData['stats']>(unit, 'stats');

  const pathFollower = new PathFollower({
    path,
    speed: stats.speed * 0.2,
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
