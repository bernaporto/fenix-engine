import { Vector3 as THREE_Vector3 } from 'three';
import { Behaviour } from '@fenix-engine/core/@types';
import { Camera } from '@fenix-engine/core/Units';
import { degreesToRadians } from '@fenix-engine/utilities/misc';
import type {
  MouseDragState,
  MouseHandler,
} from '@fenix-engine/services/Input/MouseHandler';
import { Vector2 } from '@fenix-engine/core/Math';
import { Constants } from '@/constants';
import { store } from '@/store';
import { isCamera } from './utils';

export const draggable =
  (mouse: MouseHandler): Behaviour =>
  (camera) => {
    if (!isCamera(camera)) {
      throw new Error('Unit is not a camera');
    }

    mouse.state.subscribe((state) => {
      if (state.type === 'drag') {
        handleDrag(camera, state);
      }
    });
  };

const handleDrag = (camera: Camera, state: MouseDragState) => {
  const { delta: mouseDelta } = state;
  const currPos = camera.transform.position;
  const posDelta = new THREE_Vector3(mouseDelta.x, 0, mouseDelta.y)
    .negate()
    .multiplyScalar(Constants.PAN_SPEED)
    // compensate movement with camera angle
    .applyAxisAngle(
      new THREE_Vector3(0, 1, 0),
      degreesToRadians(camera.angle.y)
    );

  const v2Position = {
    x: currPos.x,
    y: currPos.z,
  };

  const v2Delta = {
    x: posDelta.x,
    y: posDelta.z,
  };

  const boundaries = store.get('level.boundaries');
  const position = Vector2.clamp(
    Vector2.add(v2Position, v2Delta),
    boundaries.min,
    boundaries.max
  );

  camera.transform.setPosition({
    x: position.x,
    y: currPos.y,
    z: position.y,
  });
};
