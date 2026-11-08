import { BufferAttribute, BufferGeometry } from 'three';

export const createGeometry = (
  faceCount: number,
  randomFn: (index: number) => number,
) => {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(faceCount * 3 * 3);

  for (let i = 0; i < faceCount; i++) {
    positions[i] = randomFn(i);
  }

  const positionAttribute = new BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);

  return geometry;
};
