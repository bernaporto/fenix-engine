import { clamp } from '@fenix/shared/utils';
import { Constants } from '@fenix/shared/constants';
import type { MouseWheelState } from '@fenix/engine/tools/MouseHandler';
import { Constants } from '@/constants';
import { store } from '@/store';

export const handleZoom = (state: MouseWheelState) => {
  const zoom = store.get('camera.zoom');
  const newZoom = clamp(
    Constants.MIN_ZOOM,
    Constants.MAX_ZOOM,
    zoom - (state.delta.y * Constants.ZOOM_SPEED) / 1000
  );

  store.set('camera.zoom', newZoom);
};
