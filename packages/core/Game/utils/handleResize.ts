import type { WebGLRenderer } from 'three';
import type { Scene } from '../Scene';

export const hookResizeEvent = (handleResize: VoidFunction): VoidFunction => {
  handleResize();
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

export const getResizeHandler = (renderer: WebGLRenderer) => (scene: Scene) => {
  const container = renderer.domElement.parentElement;

  if (!container) return;

  const { width, height } = container.getBoundingClientRect();

  // Update camera
  const aspect = width / height;

  // Update camera
  scene.camera.resize(aspect);

  // Update canvas
  const canvas = renderer.domElement;
  canvas.width = width;
  canvas.height = height;

  // Update renderer
  renderer.setSize(width, height);
};
