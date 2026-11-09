import type { WebGLRenderer } from 'three';
import type { VoidFunction } from '@fenix-engine/utilities/@types';
import type { Scene } from '../../Scene';
import type { StageResize } from '../../@types';

export const hookResizeEvent = (
  container: HTMLElement | null,
  handleResize: VoidFunction,
): VoidFunction => {
  handleResize();
  window.addEventListener('resize', handleResize);
  let resizeObserver: ResizeObserver | null = null;
  if (container && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
  }

  return () => {
    window.removeEventListener('resize', handleResize);
    resizeObserver?.disconnect();
  };
};

export const getResizeHandler =
  (renderer: WebGLRenderer) =>
  (scene: Scene | null): StageResize | null => {
    const container = renderer.domElement.parentElement;

    if (!container) return null;

    const { width, height } = container.getBoundingClientRect();
    if (width <= 0 || height <= 0) return null;

    const aspect = width / height;
    scene?.camera?.resize(aspect);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return { width, height, aspect };
  };
