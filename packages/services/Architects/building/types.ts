import type {
  TProductionItem,
  TProductionRule,
} from '@fenix-engine/utilities/data/Generator';
import type { Vector2 } from '@fenix-engine/core/Math';

export type TArchProject = {
  blueprint: TProductionItem;
  build: () => void;
};

/* ENUMS */
export enum EBuildingRule {
  BUILDING = 'building',
  ROOF = 'roof',
  FLOOR = 'floor',
  WALL = 'wall',
}

export enum ERoofType {
  FLAT = 'flat',
  GABLE = 'gable',
  HIP = 'hip',
  MANSARD = 'mansard',
  SHED = 'shed',
}

export enum EWallType {
  EMPTY = 'empty',
  DOOR = 'door',
  WINDOW = 'window',
}

/* SETTINGS */
type TMinMax<T = number> = {
  min: T;
  max?: T;
};

export type TBuildingSettings = {
  building: {
    size: Vector2;
  };
  floors: TMinMax;
  roof: {
    types: ERoofType[];
  };
  wall: {
    types: EWallType[];
  };
};

/* RULES */
type TDataMap = Record<string, unknown>;
export type TBuildingRule<T extends TDataMap = TDataMap> = TProductionRule<
  TBuildingSettings,
  T
>;
