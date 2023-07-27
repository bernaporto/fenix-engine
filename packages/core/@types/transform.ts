import type { Vector3 } from '../Math';

export type Transformable = {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
};

type TransformEnabled = {
  lookAt: (target: Vector3) => void;

  setPosition: (value: Vector3) => void;
  setRotation: (value: Vector3) => void;
  setScale: (value: Vector3) => void;

  rotateX: (value: number) => void;
  rotateY: (value: number) => void;
  rotateZ: (value: number) => void;
};

export type TransformController = Transformable & TransformEnabled;
