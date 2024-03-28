import type { TLinkedTree } from '@fenix-engine/utilities/data/LinkedTree';
import type { TPRNG } from '@fenix-engine/utilities/PRNG';
import type {
  TProductionItem,
  TProductionRule,
} from '@fenix-engine/utilities/data/Generator';
import type { Unit } from '@fenix-engine/core/Units';
import type { Vector2 } from '@fenix-engine/core/Math';

export type TBlueprint = TLinkedTree<TProductionItem>;

export type TArchProject = {
  unit: Unit;
  seed: number;
};

/* ENUMS */
export enum EBuildingRule {
  BUILDING = 'building',
  ROOF = 'roof',
  FLOOR = 'floor',
  WALL = 'wall',
}

export enum EFaceDirection {
  NORTH = 'north',
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west',
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

export enum ETileType {
  CENTER = 'center',
  CORNER = 'corner',
  EDGE = 'edge',
}

/* SETTINGS */

/* BUILDING */
export type TBuildingConfig = {
  size: Vector2;
  entranceOn?: EFaceDirection;
  allowWindowsOn?: EFaceDirection[];
};

/* FLOOR */
export type TFloorStrategy = 'default' | 'random';
export type TFloorConfig = {
  count: TMinMax;
  mirror?: boolean;
  strategy?: TFloorStrategy;
};

/* ROOF */
export type TRoofConfig = {
  allowed?: ERoofType[];
};

/* WALL */
export type TWallConfig = {
  disallowed?: EWallType[];
};

export type TBuildingSettings = {
  building: TBuildingConfig;
  floors: TFloorConfig;
  roof?: TRoofConfig;
  seed?: number;
  walls?: TWallConfig;
};

/* RULES */
type TDataMap = Record<string, unknown>;
export type TBuildingRule<T extends TDataMap = TDataMap> = TProductionRule<
  Omit<TBuildingSettings, 'seed'> & {
    defaultPRNG: TPRNG;
    seed: number;
  },
  T
>;

/* UTILS */
type TMinMax<T = number> = {
  min: T;
  max?: T;
};
