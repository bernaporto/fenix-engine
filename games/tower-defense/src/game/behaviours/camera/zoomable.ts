import { Constants } from '@/constants';
import { Behaviour } from '@fenix-engine/core/@types';
import { Camera } from '@fenix-engine/core/Units';
import type {
  MouseHandler,
  MouseWheelState,
} from '@fenix-engine/services/Input/MouseHandler';
import { clamp } from '@fenix-engine/utilities/misc';
import { isCamera } from './utils';

export const zoomable =
  (mouse: MouseHandler): Behaviour =>
  (camera) => {
    if (!isCamera(camera)) {
      throw new Error('Unit is not a camera');
    }

    camera.setZoom(Constants.MIN_ZOOM);

    mouse.state.subscribe((state) => {
      if (state.type === 'wheel') {
        handleZoom(camera, state);
      }
    });
  };

export const handleZoom = (camera: Camera, state: MouseWheelState) => {
  const newZoom = clamp(
    Constants.MIN_ZOOM,
    Constants.MAX_ZOOM,
    camera.zoom - (state.delta.y * Constants.ZOOM_SPEED) / 1000
  );

  camera.setZoom(newZoom);
};
