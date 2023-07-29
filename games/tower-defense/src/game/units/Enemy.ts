import { EnemyType } from '@/types';
import { Prefab } from '@fenix-engine/core/Units';

export class Enemy extends Prefab {
  constructor(type: EnemyType) {
    super({
      path: `assets/puppets/${type}.prefab`,
    });
  }
}
