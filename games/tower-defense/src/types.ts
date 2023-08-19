import type { Vector2, Vector3 } from '@fenix-engine/core/Math';
import type { AnyContext } from '@fenix-engine/ui/@types';

export type EnemyType = 'goblin' | 'orc' | 'goblin-runner' | 'armored-orc';

export type TowerType =
  | 'empty'
  | 'watch'
  | 'trebouchet'
  | 'ice'
  | 'flame-thrower'
  | 'tesla'
  | 'poison';

// DEBUG
export type DebugState = {
  towers: boolean;
};

// LEVEL
export type EnemyGroup = {
  count: number;
  type: EnemyType;
};

export type EnemyPack = {
  enemies: EnemyGroup[];
};

export type Wave = {
  packs: EnemyPack[];
};

export type WaveData = Wave[];

export type LevelState = {
  availableTowers: TowerType[];
  boundaries: {
    min: Vector2;
    max: Vector2;
  };
  path: Vector2[];
  totalDefense: number;
  totalWaves: number;
};

// GAMEPLAY
type UnitData<T, U> = {
  description: string;
  name: string;
  type: T;
  stats: U;
  icon?: string;
  prefab?: string;
};

export type EnemyData = UnitData<
  EnemyType,
  {
    damage: number;
    health: number;
    speed: number;
    reward: number;
  }
>;

export type ProjectileData = {
  damage: number;
  initialAngle: number;
  speed: number;
  startPosition: Vector3;
  targetOffset: Vector3;
};

export type TowerData = UnitData<
  TowerType,
  {
    cooldown: number;
    cost: number;
    range: number;
    projectile: ProjectileData;
  }
> & {
  upgrades: Record<string, number>[];
};

export type GameplayConfig = {
  enemies: Record<string, EnemyData>;
  towers: Record<string, TowerData>;
};

type GameplayStats = {
  coins: number;
  currentWave: number;
  defense: number;
  waveStatus: 'idle' | 'running' | 'finished';
};

type SelectedItem = {
  key: string;
  type: TowerType;
  position: Vector2;
  data?: TowerData;
};

export type SelectableItem = TowerType;

type TowerSlotState = {
  [key: string]: TowerType;
};

type GameplayState = {
  stats: GameplayStats;
  selected: null | SelectedItem;
  towerSlots: TowerSlotState;
};

// GAME STATE
export type GameState = {
  loopState:
    | 'preLoad'
    | 'load'
    | 'inMenu'
    | 'inGame'
    | 'paused'
    | 'gameOver'
    | 'gameWin';
  config: GameplayConfig;
  debug: DebugState;
  level: LevelState;
  gameplay: GameplayState;
};

// UI
export type ContextHandler = () => AnyContext;
