/**
 * Warp.js - Warp sequence controller
 * Handles the asteroid field navigation between levels with three phases:
 * accelerate, cruise, and decelerate
 */

import { removeFromScene as BlackPortal_removeFromScene } from './BlackPortal.js';
import { removeFromScene as Grid_removeFromScene, addToScene as Grid_addToScene } from './Grid.js';
import { setSkyColour, getHorizonDiv, updateShieldLossStatic } from './Display.js';
import { css as C64css } from './C64.js';
import { useWarpControls, getCurrent as Controls_getCurrent, interpretKeys } from './Controls.js';
import { newInstance as Asteroid_newInstance, collideWithPlayer as Asteroid_collideWithPlayer } from './Asteroid.js';
import { update as Camera_update } from './Camera.js';
import { nextLevel } from './Level.js';
import { setShooting as Keys_setShooting } from './Keys.js';
import { random } from './UTIL.js';
import { log, panic } from './UTIL.js';
import { PLAYER_DEATH_TIMEOUT_MS } from './Encounter.js';

// CLAUDE-TODO: Replace with actual State import when State.js is converted to ES6 module
const State = {
  actors: { reset: () => {} },
  setupGameOver: () => {},
  initLevel: () => {},
  setupWaitForEnemy: () => {}
};

// CLAUDE-TODO: Replace with actual Player import when Player.js is converted to ES6 module
const Player = {
  position: { x: 0, y: 0, z: 0, copy: () => {} },
  rotation: { x: 0, y: 0, z: 0, copy: () => {} },
  update: () => {},
  shieldsLeft: 0,
  timeOfDeath: 0,
  isAlive: true,
  awardBonusShield: () => {}
};

// CLAUDE-TODO: Replace with actual clock reference when main game loop is modularized
const clock = {
  oldTime: 0
};

// CLAUDE-TODO: Replace with actual scene reference when MY3/rendering is fully modularized
const scene = {
  add: () => {},
  remove: () => {}
};

// Timing constants
export const TIME_ACCELERATING_MS = 9000; // measured
export const TIME_CRUISING_MS = 11000; // measured
export const TIME_DECELERATING_MS = 9000; // measured

export const MAX_SPEED = 6.0;

// Warp states
export const STATE_ACCELERATE = 'accelerate';
export const STATE_CRUISE = 'cruise';
export const STATE_DECELERATE = 'decelerate';
export const STATE_PLAYER_HIT = 'playerHit';
export const STATE_WAIT_TO_EXIT = 'waitToExit';

// Module state
let state = null;
let enteredAt = null;
let asteroids = []; // asteroid references for cleanup

/**
 * Initialize the warp system
 * (Currently a no-op since asteroids are created at runtime)
 */
export function init() {
  // no op since asteroids are created at runtime now
}

/**
 * Set up the warp sequence
 * Removes UI elements, resets actors, and begins acceleration
 */
export function setup() {
  // remove selected elements from the display
  BlackPortal_removeFromScene();
  Grid_removeFromScene();
  setSkyColour(C64css.black);
  getHorizonDiv().style.display = 'none';

  State.actors.reset();
  useWarpControls();

  enteredAt = clock.oldTime;

  state = STATE_ACCELERATE;
  log('warp: accelerating');

  // set up acceleration phase
  const tween = new window.TWEEN.Tween(Controls_getCurrent()).to({ movementSpeed: MAX_SPEED }, TIME_ACCELERATING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function() {
    log('acceleration tween complete');
  });
  tween.start();
}

/**
 * Remove all asteroids from the scene
 */
function removeAsteroidsFromScene() {
  asteroids.forEach(function(asteroid) {
    scene.remove(asteroid);
  });
  // forget this round's asteroids
  asteroids = [];
}

/**
 * Create asteroids in front of the player
 * @param {number} timeDeltaMillis - Time elapsed since last update
 */
function createAsteroidsInFrontOfPlayer(timeDeltaMillis) {
  // TODO set ASTEROIDS_CREATED_PER_SECOND and tween it according to phase
  // otherwise we are 1. more dense when going slow and 2. FPS will affect difficulty
  const asteroid = Asteroid_newInstance();
  asteroid.position.copy(Player.position);
  asteroid.rotation.copy(Player.rotation);
  asteroid.translateZ(-15000); // FIXME adjust this
  asteroid.translateX(random(-15000, 15000)); // FIXME adjust this
  scene.add(asteroid);
  asteroids.push(asteroid);
}

/**
 * Remove asteroids behind the player
 * @param {number} timeDeltaMillis - Time elapsed since last update
 * @returns {boolean} Whether any asteroids were removed
 */
function removeAsteroidsBehindPlayer(timeDeltaMillis) {
  // TODO
  return false;
}

/**
 * Check for collisions between player and asteroids
 */
function checkCollisions() {
  asteroids.forEach(function(asteroid) {
    Asteroid_collideWithPlayer(asteroid.position);
  });
}

/**
 * Update player movement and collisions
 * @param {number} timeDeltaMillis - Time elapsed since last update
 */
function updateMovement(timeDeltaMillis) {
  window.TWEEN.update();
  Controls_getCurrent().update(timeDeltaMillis);
  Player.update(timeDeltaMillis);
  Camera_update(timeDeltaMillis);
  interpretKeys(timeDeltaMillis);
  checkCollisions();
  // no need to update State.actors, we're just Player and Asteroids
}

/**
 * Main update function for the warp sequence
 * Delegates to phase-specific update functions
 * @param {number} timeDeltaMillis - Time elapsed since last update
 */
export function update(timeDeltaMillis) {
  switch (state) {
    case STATE_ACCELERATE:
      updateAccelerate(timeDeltaMillis);
      break;
    case STATE_CRUISE:
      updateCruise(timeDeltaMillis);
      break;
    case STATE_DECELERATE:
      updateDecelerate(timeDeltaMillis);
      break;
    case STATE_WAIT_TO_EXIT:
      updateWaitToExit(timeDeltaMillis);
      break;
    case STATE_PLAYER_HIT:
      updatePlayerHit();
      break;
    default:
      panic('unknown Warp state: ' + state);
  }
}

/**
 * Update during acceleration phase
 * @param {number} timeDeltaMillis - Time elapsed since last update
 */
function updateAccelerate(timeDeltaMillis) {
  updateMovement(timeDeltaMillis);
  createAsteroidsInFrontOfPlayer(timeDeltaMillis);

  if ((clock.oldTime - enteredAt) > TIME_ACCELERATING_MS) {
    state = STATE_CRUISE;
    log('warp: cruising');
  }
}

/**
 * Update during cruise phase
 * @param {number} timeDeltaMillis - Time elapsed since last update
 */
function updateCruise(timeDeltaMillis) {
  updateMovement(timeDeltaMillis);
  createAsteroidsInFrontOfPlayer(timeDeltaMillis);

  if ((clock.oldTime - enteredAt - TIME_ACCELERATING_MS) > TIME_CRUISING_MS) {
    state = STATE_DECELERATE;
    log('warp: decelerating');

    const tween = new window.TWEEN.Tween(Controls_getCurrent()).to({ movementSpeed: 0 }, TIME_DECELERATING_MS);
    //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
    tween.onComplete(function() {
      log('acceleration tween complete');
    });
    tween.start();
  }
}

/**
 * Update during deceleration phase
 * @param {number} timeDeltaMillis - Time elapsed since last update
 */
function updateDecelerate(timeDeltaMillis) {
  updateMovement(timeDeltaMillis);
  // don't create new asteroids in deceleration phase

  if ((clock.oldTime - enteredAt - TIME_ACCELERATING_MS - TIME_CRUISING_MS) > TIME_DECELERATING_MS) {
    state = STATE_WAIT_TO_EXIT;
    log('warp: waiting to exit');
  }
}

/**
 * Update when player is hit
 * If shields are gone then game over; else play death animation and return to previous level
 */
function updatePlayerHit() {
  updateShieldLossStatic();

  if (Player.shieldsLeft < 0) {
    state = null;
    removeAsteroidsFromScene();  // FIXME asteroids disappear, will be replaced by death fuzz
    State.setupGameOver();
  }
  else if (clock.oldTime > (Player.timeOfDeath + PLAYER_DEATH_TIMEOUT_MS)) {
    Keys_setShooting(false);
    Player.isAlive = true;
    restoreLevel();
  }
}

/**
 * Update while waiting to exit warp sequence
 * Awards bonus shield and advances to next level
 * @param {number} timeDeltaMillis - Time elapsed since last update
 */
function updateWaitToExit(timeDeltaMillis) {
  // TODO proper warp exit
  log('warp ended successfully');
  nextLevel();
  Player.awardBonusShield();

  state = null;
  restoreLevel();
}

/**
 * Restore the level after warp sequence ends
 * Removes asteroids and resets level state
 */
function restoreLevel() {
  removeAsteroidsFromScene();

  State.initLevel();  // does all the heavy lifting of state reset

  // restore the elements we selectively hid earlier
  getHorizonDiv().style.display = 'block';
  Grid_addToScene();

  State.setupWaitForEnemy();
}

// Getters and setters for module state
export function getState() { return state; }
export function setState(newState) { state = newState; }
export function getEnteredAt() { return enteredAt; }
export function getAsteroids() { return asteroids; }

// Default export for backward compatibility
export default {
  TIME_ACCELERATING_MS,
  TIME_CRUISING_MS,
  TIME_DECELERATING_MS,
  MAX_SPEED,
  STATE_ACCELERATE,
  STATE_CRUISE,
  STATE_DECELERATE,
  STATE_PLAYER_HIT,
  STATE_WAIT_TO_EXIT,
  get state() { return state; },
  set state(newState) { state = newState; },
  get enteredAt() { return enteredAt; },
  get asteroids() { return asteroids; },
  init,
  setup,
  update,
  getState,
  setState,
  getEnteredAt,
  getAsteroids
};
