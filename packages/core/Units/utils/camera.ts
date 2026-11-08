import { OrthographicCamera, PerspectiveCamera } from 'three';

export const resizeCamera = (
  camera: OrthographicCamera | PerspectiveCamera,
  aspect: number,
  viewSize = 20,
) => {
  if (camera instanceof PerspectiveCamera) {
    resizePerspectiveCamera(camera, aspect);
  } else {
    resizeOrthographicCamera(camera, aspect, viewSize);
  }
};

const resizePerspectiveCamera = (camera: PerspectiveCamera, aspect: number) => {
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
};

const resizeOrthographicCamera = (
  camera: OrthographicCamera,
  aspect: number,
  viewSize: number,
) => {
  camera.left = (-aspect * viewSize) / 2;
  camera.right = (aspect * viewSize) / 2;
  camera.top = viewSize / 2;
  camera.bottom = -viewSize / 2;
  camera.updateProjectionMatrix();
};
