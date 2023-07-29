import { Behaviour } from '@fenix-engine/core/@types';
import { Puppet } from '@fenix-engine/core/Units';
import { EnemyType } from '@/types';
import { getProperty } from '@/game/helpers';

export const puppeteer: Behaviour = (unit) => {
  const type = getProperty<EnemyType>(unit, 'type');

  return {
    onLoad: () => {
      const puppet = unit.children.find(
        (child) => child instanceof Puppet
      ) as Puppet;

      if (!puppet) {
        throw new Error('Unit is not a puppet');
      }

      puppet.puppeteer.play(`${type}@run`);

      // unit.store.subscribe('health', (health) => {
      //   puppet.puppeteer.play(`${type}@hit`);

      //   if (health <= 0) {
      //     puppet.puppeteer.play(`${type}@die`);
      //   }
      // });
    },
  };
};
