export const TDConstants = {
  ENEMY_SPEED_MULTIPLIER: 0.175,

  INTERVAL_ENEMY_SPAWN: 1_500,
  INTERVAL_ENEMY_GROUP: 2_500,
  INTERVAL_ENEMY_PACK: 3_000,

  // Temporary
  INITIAL_COINS: 20,
  INTERVAL_WAVE: 5_000,
  LEVEL_HEALTH: 10,

  LEVEL_PADDING: Object.freeze({ x: 8, y: 9 }),
  MIN_ZOOM: 3,
  MAX_ZOOM: 4.3,
  PAN_SPEED: 0.005,

  TILE_OFFSET: Object.freeze({ x: 0.5, y: 0.5 }),

  // UI
  MENU_OFFSET: Object.freeze({ x: 0, y: -40 }),
  MENU_RESTING_POSITION: Object.freeze({ x: -200, y: -200 }),
  MENU_ANIM_DURATION: 300,
};
