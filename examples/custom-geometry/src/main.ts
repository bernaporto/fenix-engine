import { Mesh, MeshBasicMaterial } from 'three';
import { game } from '@fenix-engine/core';
import { createGeometry } from './createGeometry';
import { Unit } from '@fenix-engine/core/Units';

game.behaviours.register('orbit', (unit) => ({
  onUpdate: ({ deltaTime }) => {
    unit.transform.rotateY(15 * deltaTime);
  },
}));

const populateScene = () => {
  const scene = game.stage.currentScene;
  if (!scene) return;

  // const geometry = createGeometry(100, () => (Math.random() - 0.5) * 2);
  const geometry = createGeometry(1000, (i) =>
    Math.sin(i * Math.random() * Math.PI),
  );
  const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  const mesh = new Mesh(geometry, material);
  const unit = new Unit({
    behaviours: ['orbit'],
  });
  unit.node.add(mesh);

  scene.append(unit);
};

game
  .init({
    containerId: 'game',
    manifest: 'assets/manifest.json',
    autoLoad: { sceneKey: 'basic-scene' },
  })
  .then(async ({ scenePromise }) => {
    if (!scenePromise) throw new Error('The initial scene was not loaded.');
    await scenePromise;
    populateScene();
  })
  .catch((error: unknown) => {
    console.error('Failed to start the custom geometry example', error);
  });
