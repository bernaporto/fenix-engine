import { clamp } from '@fenix/shared/utils';
import { Constants } from '@fenix/shared/constants';
import type { MouseWheelState } from '@fenix/engine/tools/MouseHandler';
import { TDConstants } from '@/constants';
import { store } from '@/store';

export const handleZoom = (state: MouseWheelState) => {
  const zoom = store.get('camera.zoom');
  const newZoom = clamp(
    TDConstants.MIN_ZOOM,
    TDConstants.MAX_ZOOM,
    zoom - (state.delta.y * Constants.ZOOM_SPEED) / 1000,
  );

  store.set('camera.zoom', newZoom);
};
