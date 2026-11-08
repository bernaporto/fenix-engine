import { degreesToRadians } from '@fenix-engine/utilities/misc';
import type { Unit } from '../Units';
import { Vector3 } from '../Math';
import type { TransformController } from '../@types';

export const makeTransformController = (unit: Unit): TransformController => {
  let position = Vector3.zero;
  let rotation = Vector3.zero;
  let scale = Vector3.one;

  return {
    get position() {
      return Vector3.copy(position);
    },

    get rotation() {
      return Vector3.copy(rotation);
    },

    get scale() {
      return Vector3.copy(scale);
    },

    lookAt: (target: Vector3) => {
      unit.node.lookAt(target.x, target.y, target.z);
    },

    rotateX: (value: number) => {
      unit.node.rotateX(degreesToRadians(value));
    },

    rotateY: (value: number) => {
      unit.node.rotateY(degreesToRadians(value));
    },

    rotateZ: (value: number) => {
      unit.node.rotateZ(degreesToRadians(value));
    },

    setPosition: (value: Vector3) => {
      position = Vector3.copy(value);

      unit.node.position.set(position.x, position.y, position.z);
    },

    setRotation: (value: Vector3) => {
      rotation = Vector3.copy(value);

      unit.node.rotation.set(
        degreesToRadians(rotation.x),
        degreesToRadians(rotation.y),
        degreesToRadians(rotation.z),
      );
    },

    setScale: (value: Vector3) => {
      scale = Vector3.copy(value);

      unit.node.scale.set(scale.x, scale.y, scale.z);
    },
  };
};
