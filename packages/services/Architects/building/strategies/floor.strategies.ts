import { isValidObject } from '@fenix-engine/utilities/misc';
import LinkedTree, {
  type TLinkedTree,
} from '@fenix-engine/utilities/data/LinkedTree';
import type { TProductionItem } from '@fenix-engine/utilities/data/Generator';
import { Vector2, type Vector3 } from '@fenix-engine/core/Math';
import { EBuildingRule, EWallType, type TBlueprint } from '../types';
import type { TWallMetadata } from '../rules';

const applyMirror = (blueprint: TBlueprint, buildingSize: Vector2) => {
  const halfPoint = Vector2.divideScalar(buildingSize, 2);
  const mirrorArea = {
    x: halfPoint.x,
    y: buildingSize.y + 1,
  };

  LinkedTree.traverse(blueprint, (node) => {
    if (node.payload.type !== EBuildingRule.FLOOR) return;

    const branch = LinkedTree.branch(node);
    node.children.forEach((child) => {
      if (!isWallMetadata(child.payload.metadata)) return;

      const metadata = child.payload.metadata;
      if (isInsideMirrorArea(metadata.position, mirrorArea)) return;

      const oppositeChild = findOppositeChild(
        metadata.position,
        halfPoint,
        branch,
        true
      );

      if (
        !oppositeChild ||
        metadata.type === EWallType.DOOR ||
        oppositeChild.type === EWallType.DOOR
      ) {
        return;
      }

      child.payload.metadata = {
        ...metadata,
        ...oppositeChild,
        position: metadata.position,
        direction: metadata.direction,
      };
    });
  });
};

const isWallMetadata = (metadata: unknown): metadata is TWallMetadata =>
  isValidObject(metadata) &&
  'type' in metadata &&
  'position' in metadata &&
  'direction' in metadata;

const findOppositeChild = (
  position: Vector3,
  mirrorPos: Vector2,
  tree: TLinkedTree<TProductionItem>,
  mirrorX = true
): TWallMetadata | null => {
  const x = mirrorX ? mirrorPos.x - (position.x - mirrorPos.x) : position.x;
  const y = !mirrorX ? mirrorPos.y - (position.z - mirrorPos.y) : position.z;

  const node = tree.findNode((node) => {
    if (!isWallMetadata(node.payload.metadata)) {
      return false;
    }
    const metadata = node.payload.metadata;
    return metadata.position.x === x && metadata.position.z === y;
  });

  return (node?.payload.metadata as TWallMetadata) ?? null;
};

const isInsideMirrorArea = (position: Vector3, mirrorArea: Vector2) =>
  position.x < mirrorArea.x && position.z < mirrorArea.y;

export const strategies = {
  mirror: applyMirror,
};
