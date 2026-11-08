import { Vector2 } from '@fenix-engine/core/Math';
import { EFaceDirection, ETileType } from '../types';

export const getTileType = (position: Vector2, maxPos: Vector2): ETileType => {
  if (
    Vector2.equals(position, Vector2.zero) ||
    Vector2.equals(position, maxPos) ||
    Vector2.equals(position, { x: 0, y: maxPos.y }) ||
    Vector2.equals(position, { x: maxPos.x, y: 0 })
  ) {
    return ETileType.CORNER;
  }

  if (
    position.x === 0 ||
    position.y === 0 ||
    position.x === maxPos.x ||
    position.y === maxPos.y
  ) {
    return ETileType.EDGE;
  }

  return ETileType.CENTER;
};

export const getFacingDirection = (
  pos: Vector2,
  maxPos: Vector2,
  tileType: ETileType,
): EFaceDirection => {
  if (tileType === ETileType.CORNER) {
    if (Vector2.equals(pos, Vector2.zero)) return EFaceDirection.NORTH;
    if (Vector2.equals(pos, { x: maxPos.x, y: 0 })) return EFaceDirection.EAST;
    if (Vector2.equals(pos, maxPos)) return EFaceDirection.SOUTH;
    if (Vector2.equals(pos, { x: 0, y: maxPos.y })) return EFaceDirection.WEST;
  }

  if (tileType === ETileType.EDGE) {
    if (pos.y === 0) return EFaceDirection.NORTH;
    if (pos.x === 0) return EFaceDirection.WEST;
    if (pos.y === maxPos.y) return EFaceDirection.SOUTH;
    if (pos.x === maxPos.x) return EFaceDirection.EAST;
  }

  return EFaceDirection.NORTH;
};

export const offsetByDirection = (
  position: Vector2,
  direction: EFaceDirection,
  offset: number = 0,
): Vector2 => {
  if (offset === 0) return Vector2.copy(position);

  switch (direction) {
    case EFaceDirection.NORTH:
    case EFaceDirection.SOUTH:
      return Vector2.add(position, { x: offset, y: 0 });
    case EFaceDirection.EAST:
    case EFaceDirection.WEST:
      return Vector2.add(position, { x: 0, y: offset });
  }
};
