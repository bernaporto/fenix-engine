import type { TPRNG } from '@fenix-engine/utilities/PRNG';
import type {
  TProductionItem,
  TProductionRule,
} from '@fenix-engine/utilities/data/Generator';
import { Unit } from '@fenix-engine/core/Units';
import type { Vector2 } from '@fenix-engine/core/Math';
import type { TTheme } from '../theme';

export type TArchProject = {
  blueprint: TProductionItem;
  build: (theme: TTheme) => Unit;
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
type TMinMax<T = number> = {
  min: T;
  max?: T;
};
type TBooleanVector2 = {
  x: boolean;
  y: boolean;
};

export type TBuildingSettings = {
  building: {
    size: Vector2;
    entrance?: EFaceDirection;
    windows?: EFaceDirection[];
  };
  floors: TMinMax & {
    mirror?: TBooleanVector2;
    strategy?: 'random' | 'copy';
  };
  roof?: {
    allowed: ERoofType[];
  };
  seed?: number;
  walls?: {
    disallowed: EWallType[];
  };
};

/* RULES */
type TDataMap = Record<string, unknown>;
export type TBuildingRule<T extends TDataMap = TDataMap> = TProductionRule<
  TBuildingSettings & {
    defaultPRNG: TPRNG;
  },
  T
>;
