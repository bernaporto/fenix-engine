import { Scene } from '@fenix-engine/core/Scene';
import { Puppet } from '@fenix-engine/core/Units';

export const handleSpawnEnemies = (scene: Scene) => {
  setInterval(() => {
    const goblin = new Puppet({
      defaultClip: 'goblin@run',
      path: 'assets/puppets/goblin.glb',
      behaviours: ['pathFollower'],
      material: 'default-material',
      castShadow: true,
      scale: { x: 0.2, y: 0.2, z: 0.2 },
    });

    scene.append(goblin);
  }, 1000);
};
