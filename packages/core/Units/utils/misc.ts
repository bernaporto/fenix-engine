import { Object3D } from 'three';
import { Unit } from '../Unit';

export const assignUnitToNode = (unit: Unit) => {
  unit.node.userData.unit = unit;
};

export const findNodeUnit = (node: Object3D): Unit | null => {
  if (node.userData.unit) {
    return node.userData.unit;
  }

  if (node.parent) {
    return findNodeUnit(node.parent);
  }

  return null;
};
