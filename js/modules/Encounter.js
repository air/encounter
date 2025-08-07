'use strict';

import * as Obelisk from './Obelisk.js';

// constants modelling the original game.
// time for complete rotation: 9s
// time to pass 10 obelisks: 8s
export const DRAW_DISTANCE = 3000; // use with init3D() for the real C64 draw distance
export const CAMERA_HEIGHT = Obelisk.HEIGHT / 2;
export const PLAYER_LIVES = 4;
export const MOVEMENT_SPEED = 1.2;
export const TURN_SPEED = 0.0007;
export const SHOT_SPEED = 2.8;
export const SHOT_INTERVAL_MS = 400; // Player shot interval, as opposed to Enemy's
export const MAX_PLAYERS_SHOTS_ALLOWED = 15; // original has illusion of no shot limit or range limit, but max 3 on screen
export const TIME_TO_SPAWN_ENEMY_MS = 3000; // TODO not measured on original
export const TIME_TO_ENTER_PORTAL_MS = 12000; // TODO not measured
export const ENEMY_SPAWN_DISTANCE_MAX = 10000; // not measured
export const PORTAL_SPAWN_DISTANCE_MAX = 10000; // not measured
export const MISSILE_SPAWN_DISTANCE_MIN = 8000; // not measured
export const PLAYER_INITIAL_ROTATION = 0.259;
export const PLAYER_DEATH_TIMEOUT_MS = 2000; // time before you can play once being hit
export const PLAYER_MAX_SHIELDS = 9; // from instruction manual

// CLAUDE-TODO: These initialization calls should be handled elsewhere when modules are properly initialized
// For now, commenting out the actual game initialization to prevent errors
// MY3.init3d(DRAW_DISTANCE * 3, Display.ZINDEX_CANVAS);
// State.init();
// MY3.startAnimationLoop();

// Export default object for backward compatibility
export default {
  DRAW_DISTANCE,
  CAMERA_HEIGHT,
  PLAYER_LIVES,
  MOVEMENT_SPEED,
  TURN_SPEED,
  SHOT_SPEED,
  SHOT_INTERVAL_MS,
  MAX_PLAYERS_SHOTS_ALLOWED,
  TIME_TO_SPAWN_ENEMY_MS,
  TIME_TO_ENTER_PORTAL_MS,
  ENEMY_SPAWN_DISTANCE_MAX,
  PORTAL_SPAWN_DISTANCE_MAX,
  MISSILE_SPAWN_DISTANCE_MIN,
  PLAYER_INITIAL_ROTATION,
  PLAYER_DEATH_TIMEOUT_MS,
  PLAYER_MAX_SHIELDS
};