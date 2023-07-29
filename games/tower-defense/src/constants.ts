export const Constants = {
  ENEMY_SPEED_MULTIPLIER: 0.2,

  INTERVAL_ENEMY_SPAWN: 1_500,
  INTERVAL_ENEMY_GROUP: 2_500,
  INTERVAL_ENEMY_PACK: 3_000,

  LEVEL_PADDING: Object.freeze({ x: 8, y: 9 }),
  PAN_SPEED: 0.005,

  MIN_ZOOM: 3,
  MAX_ZOOM: 4.3,
  ZOOM_SPEED: 0.4,

  // UI
  MENU_OFFSET: Object.freeze({ x: 0, y: -40 }),
  MENU_RESTING_POSITION: Object.freeze({ x: -200, y: -200 }),
  MENU_ANIM_DURATION: 300,
};

export enum BehaviourType {
  // Camera
  Draggable = 'draggable',
  Zoomable = 'zoomable',
  // Enemy
  EnemyPuppeteer = 'enemyPuppeteer',
  EnemyLifecycleManager = 'enemyLifecycleManager',
  PathFollower = 'pathFollower',
  // Gameplay
  Interactable = 'interactable',
  WaveController = 'waveController',
  // Tower
  TowerController = 'towerController',
  TowerSlotManager = 'towerSlotManager',
}

export enum CustomEventType {
  OnClick = 'custom:onClick',
}
