import { Vector3 as THREE_Vector3 } from 'three';
import { Constants } from '@fenix/shared/constants';
import { degreesToRadians } from '@fenix/shared/utils';
import type { MouseDragState } from '@fenix/engine/tools/MouseHandler';
import { Vector2 } from '@fenix/shared/vector';
import { store } from '@/store';
import { TDConstants } from '@/constants';

export const handlePan = (state: MouseDragState) => {
  const { delta } = state;
  const currPos = store.get('camera.position');
  const posDelta = new THREE_Vector3(delta.x, 0, delta.y)
    .negate()
    .multiplyScalar(TDConstants.PAN_SPEED)
    // compensate movement with camera angle
    .applyAxisAngle(new THREE_Vector3(0, 1, 0), degreesToRadians(45));

  const v2Delta = {
    x: posDelta.x,
    y: posDelta.z,
  };

  const boundaries = store.get('camera.boundaries');
  const position = Vector2.clamp(
    Vector2.add(currPos, v2Delta),
    boundaries.min,
    boundaries.max
  );

  store.set('camera.position', position);
};
