import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Camera } from '@fenix-engine/core/Units';
import { Game } from '@fenix-engine/core';

export const registerBehaviours = (game: Game) => {
  game.behaviours.register('orbit', (unit) => {
    const camera = (unit as unknown as Camera).camera;
    const controls = new OrbitControls(camera, game.renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    return {
      onUpdate: () => {
        controls.update();
      },
      onDetach: () => controls.dispose(),
    };
  });
};
