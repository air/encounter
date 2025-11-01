/**
 * Enemy.js - Base enemy class and spawning system
 * Top-level class for enemy-related functionality including spawn management
 */

import { randomFromArray } from './UTIL.js';
import { log, panic } from './UTIL.js';
import { getCurrent as Level_getCurrent, getNumber as Level_getNumber } from './Level.js';
import { spawn as Missile_spawn } from './Missile.js';
import { spawnForEnemy as WhitePortal_spawnForEnemy } from './WhitePortal.js';
import { playerKilled as Sound_playerKilled } from './Sound.js';
import { at as Explode_at } from './Explode.js';
import { setYellow as Indicators_setYellow } from './Indicators.js';
import { TIME_TO_SPAWN_ENEMY_MS } from './Encounter.js';

// CLAUDE-TODO: Replace with actual State import when State.js is converted to ES6 module
const State = {
  actors: { add: () => {}, remove: () => {} },
  setupCombat: () => {},
  enemyKilled: () => {}
};

// CLAUDE-TODO: Replace with actual clock reference when main game loop is modularized
const clock = {
  oldTime: 0
};

// CLAUDE-TODO: Replace with actual Saucer imports when Saucer variants are converted to ES6 modules
const SaucerSingle = function(location) {
  this.actor = null;
  this.mesh = { position: { x: 0, y: 0, z: 0 } };
};

const SaucerTriple = function(location) {
  this.actor = null;
  this.mesh = { position: { x: 0, y: 0, z: 0 } };
};

const SaucerChaingun = function(location) {
  this.actor = null;
  this.mesh = { position: { x: 0, y: 0, z: 0 } };
};

const SaucerShotgun = function(location) {
  this.actor = null;
  this.mesh = { position: { x: 0, y: 0, z: 0 } };
};

const SaucerAutoShotgun = function(location) {
  this.actor = null;
  this.mesh = { position: { x: 0, y: 0, z: 0 } };
};

// Enemy type constants
export const TYPE_SAUCER_SINGLE = 'saucerSingle';
export const TYPE_SAUCER_TRIPLE = 'saucerTriple';
export const TYPE_SAUCER_CHAINGUN = 'saucerChaingun';
export const TYPE_SAUCER_SHOTGUN = 'saucerShotgun';
export const TYPE_SAUCER_AUTOSHOTGUN = 'saucerAutoShotgun';
export const TYPE_MISSILE = 'missile';

// Module state
let current = null; // reference to current enemy object, whatever that is
let isAlive = false;
let isFirstOnLevel = null; // is this the first enemy on the level? If so it's not random
let spawnTimerStartedAt = null;

/**
 * Reset enemy state for a new level
 */
export function reset() {
  isFirstOnLevel = true;
}

/**
 * Start the spawn timer for the next enemy
 */
export function startSpawnTimer() {
  log('started enemy spawn timer');
  spawnTimerStartedAt = clock.oldTime;
}

/**
 * Check if spawn timer has elapsed and spawn if ready
 */
export function spawnIfReady() {
  if ((clock.oldTime - spawnTimerStartedAt) > TIME_TO_SPAWN_ENEMY_MS) {
    spawn();
    State.setupCombat();
  }
}

/**
 * Spawn an enemy based on level configuration
 * Uses first enemy for level or random from spawn table
 */
export function spawn() {
  let type = null;

  if (isFirstOnLevel) {
    type = Level_getCurrent().firstEnemy;
    isFirstOnLevel = false;
    log('using first enemy for level ' + Level_getNumber() + ': ' + type);
  }
  else {
    type = randomFromArray(Level_getCurrent().spawnTable);
    log('spawn table generated enemy: ' + type);
  }

  if (type === TYPE_MISSILE) {
    current = Missile_spawn();
    State.actors.add(current.actor);
    isAlive = true;
  }
  else {
    WhitePortal_spawnForEnemy(type);
  }
}

/**
 * Spawn a specific enemy type at a given location
 * @param {string} type - Enemy type constant
 * @param {THREE.Vector3} location - Spawn location
 */
export function spawnGivenTypeAt(type, location) {
  switch (type) {
    case TYPE_MISSILE:
      log('warn: missile spawned in spawnGivenTypeAt, ignoring location parameter');
      current = Missile_spawn();
      break;
    case TYPE_SAUCER_SINGLE:
      current = new SaucerSingle(location);
      break;
    case TYPE_SAUCER_TRIPLE:
      current = new SaucerTriple(location);
      break;
    case TYPE_SAUCER_CHAINGUN:
      current = new SaucerChaingun(location);
      break;
    case TYPE_SAUCER_SHOTGUN:
      current = new SaucerShotgun(location);
      break;
    case TYPE_SAUCER_AUTOSHOTGUN:
      current = new SaucerAutoShotgun(location);
      break;
    default:
      panic('unknown enemy type: ' + type);
  }

  State.actors.add(current.actor);
  isAlive = true;
  Indicators_setYellow(true);
}

/**
 * Enemy is hit and destroyed, but explosion still has to play out
 */
export function destroyed() {
  Sound_playerKilled();
  isAlive = false;

  State.actors.remove(current.actor);

  // if this enemy has a destroyed() decorator, invoke it
  if (typeof(current.destroyed) === 'function') {
    current.destroyed.call();
  }

  Explode_at(current.mesh.position);
}

/**
 * Explosion has finished animating
 */
export function cleared() {
  State.enemyKilled();
}

// Getters for module state
export function getCurrent() { return current; }
export function getIsAlive() { return isAlive; }
export function getIsFirstOnLevel() { return isFirstOnLevel; }
export function getSpawnTimerStartedAt() { return spawnTimerStartedAt; }

// Setters for module state
export function setCurrent(value) { current = value; }
export function setIsAlive(value) { isAlive = value; }

// Default export for backward compatibility
export default {
  TYPE_SAUCER_SINGLE,
  TYPE_SAUCER_TRIPLE,
  TYPE_SAUCER_CHAINGUN,
  TYPE_SAUCER_SHOTGUN,
  TYPE_SAUCER_AUTOSHOTGUN,
  TYPE_MISSILE,
  get current() { return current; },
  set current(value) { current = value; },
  get isAlive() { return isAlive; },
  set isAlive(value) { isAlive = value; },
  get isFirstOnLevel() { return isFirstOnLevel; },
  get spawnTimerStartedAt() { return spawnTimerStartedAt; },
  reset,
  startSpawnTimer,
  spawnIfReady,
  spawn,
  spawnGivenTypeAt,
  destroyed,
  cleared,
  getCurrent,
  getIsAlive,
  getIsFirstOnLevel,
  getSpawnTimerStartedAt,
  setCurrent,
  setIsAlive
};
