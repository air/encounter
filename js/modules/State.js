'use strict';

import { log, panic } from './UTIL.js';
import { Actors } from './Actors.js';
import Attract from './Attract.js';
import Grid from './Grid.js';
import Ground from './Ground.js';
import Sound from './Sound.js';
import Display from './Display.js';
import { init as Player_init, resetPosition as Player_resetPosition, getShieldsLeft as Player_getShieldsLeft, getTimeOfDeath as Player_getTimeOfDeath, setIsAlive as Player_setIsAlive, update as Player_update } from './Player.js';
import Missile from './Missile.js';
import Camera from './Camera.js';
import Controls from './Controls.js';
import Touch from './Touch.js';
import Radar from './Radar.js';
import Portal from './Portal.js';
import WhitePortal from './WhitePortal.js';
import BlackPortal from './BlackPortal.js';
import Warp from './Warp.js';
import GUI from './GUI.js';
import Indicators from './Indicators.js';
import Explode from './Explode.js';
import Level from './Level.js';
import Enemy from './Enemy.js';
import Keys from './Keys.js';
import Encounter from './Encounter.js';
import { getClock } from './MY3.js';

// State constants
export const ATTRACT = 'attract';
export const WAIT_FOR_ENEMY = 'waitForEnemy';
export const COMBAT = 'combat';
export const WAIT_FOR_PORTAL = 'waitForPortal';
export const WARP = 'warp';
export const PLAYER_HIT = 'playerHit';
export const GAME_OVER = 'gameOver';

// State variables
export let current = null;
export let actors = new Actors();
export let enemiesRemaining = null;
export let isPaused = false;
export let score = 0;

// Getters for state access
export function getCurrent() {
  return current;
}

export function getActors() {
  return actors;
}

export function getEnemiesRemaining() {
  return enemiesRemaining;
}

export function getIsPaused() {
  return isPaused;
}

export function getScore() {
  return score;
}

// Setters for state modification
export function setCurrent(value) {
  current = value;
}

export function setIsPaused(value) {
  isPaused = value;
}

export function setScore(value) {
  score = value;
}

// called once at startup. Go into our first state
export function init() {
  Attract.init();
  Grid.init();  // reads the camera draw distance and sizes the Grid.viewport
  Ground.init();
  Sound.init();
  Display.init();
  Player_init();
  Missile.init();
  Camera.init();
  Controls.init();
  Touch.init(); // FIXME depends on Controls.init
  Radar.init();
  Portal.init();
  WhitePortal.init();
  BlackPortal.init();
  Warp.init();
  GUI.init(); // depends on Controls.init
  Indicators.init();
  Explode.init();
  Level.init();

  setupAttract();
}

// Setup a new combat level, either on game start or moving out of warp.
// Level number is optional; by default rely on the state in Level.
export function initLevel(levelNumber) {
  if (levelNumber) {
    Level.set(levelNumber);
  }

  log('initialising level ' + Level.getNumber());
  Display.setSkyColour(Level.getCurrent().skyColor);
  Display.setHorizonColour(Level.getCurrent().horizonColor);

  Camera.useFirstPersonMode();
  Controls.useEncounterControls();
  Player_resetPosition();
  Grid.reset();
  Enemy.reset();
  Indicators.reset();
  actors.reset();

  resetEnemyCounter();
}

export function resetEnemyCounter() {
  enemiesRemaining = Level.getCurrent().enemyCount;
}

export function setupAttract() {
  current = ATTRACT;
  log('State: ' + current);
  Attract.show();
}

export function setupWaitForEnemy() {
  current = WAIT_FOR_ENEMY;
  log('State: ' + current);

  Display.update();
  Enemy.startSpawnTimer();
}

export function setupWaitForPortal() {
  current = WAIT_FOR_PORTAL;
  log('State: ' + current);

  Display.update();
  BlackPortal.startSpawnTimer();
}

export function setupCombat() {
  current = COMBAT;
  log('State: ' + current);
}

export function setupPlayerHitInCombat() {
  current = PLAYER_HIT;
  log('State: ' + current);

  Display.showShieldLossStatic();

  if (Player_getShieldsLeft() < 0) {
    setupGameOver();
  }
}

export function setupGameOver() {
  current = GAME_OVER;
  log('State: ' + current);
  // Display.setText('GAME OVER. PRESS FIRE'); // FIXME: setText doesn't exist in Display module
}

export function setupWarp() {
  current = WARP;
  log('State: ' + current);

  Warp.setup();
}

export function enemyKilled() {
  log('enemy destroyed');
  enemiesRemaining -= 1;
  if (enemiesRemaining > 0) {
    setupWaitForEnemy();
  } else {
    setupWaitForPortal();
  }
}

export function updateWaitForEnemy(timeDeltaMillis) {
  performNormalLevelUpdates(timeDeltaMillis);

  Enemy.spawnIfReady();
  Radar.update();
}

export function updateWaitForPortal(timeDeltaMillis) {
  performNormalLevelUpdates(timeDeltaMillis);

  BlackPortal.update(timeDeltaMillis);
  Radar.update();
  window.TWEEN.update();
}

export function updateCombat(timeDeltaMillis) {
  performNormalLevelUpdates(timeDeltaMillis);

  Radar.update();
  Indicators.update(); // needed for flickering effects only
  window.TWEEN.update(); // white portal animations
}

export function updatePlayerHitInCombat(timeDeltaMillis) {
  Display.updateShieldLossStatic();

  if (getClock().oldTime > (Player_getTimeOfDeath() + Encounter.PLAYER_DEATH_TIMEOUT_MS)) {
    Display.hideShieldLossStatic();
    Indicators.reset();
    actors.reset();
    Player_setIsAlive(true);
    setupWaitForEnemy();
  }
}

export function updateGameOver(timeDeltaMillis) {
  if (Keys.shooting && getClock().oldTime > (Player_getTimeOfDeath() + Encounter.PLAYER_DEATH_TIMEOUT_MS)) {
    Display.hideShieldLossStatic();
    Keys.shooting = false;
    setupAttract();
  }
}

export function performNormalLevelUpdates(timeDeltaMillis) {
  Controls.current.update(timeDeltaMillis);
  Player_update(timeDeltaMillis);
  Camera.update(timeDeltaMillis);
  Grid.update();

  // update non-Player game actors
  if (!isPaused) {
    actors.update(timeDeltaMillis);
    Controls.interpretKeys(timeDeltaMillis);
  }
}

// Main update function called from game loop
export function update(timeDeltaMillis) {
  switch (current) {
    case ATTRACT:
      Attract.update(timeDeltaMillis);
      break;
    case COMBAT:
      updateCombat(timeDeltaMillis);
      break;
    case WAIT_FOR_PORTAL:
      updateWaitForPortal(timeDeltaMillis);
      break;
    case WAIT_FOR_ENEMY:
      updateWaitForEnemy(timeDeltaMillis);
      break;
    case WARP:
      Warp.update(timeDeltaMillis);
      break;
    case PLAYER_HIT:
      updatePlayerHitInCombat(timeDeltaMillis);
      break;
    case GAME_OVER:
      updateGameOver(timeDeltaMillis);
      break;
    default:
      panic('unknown state: ', current);
  }
}

// Export default object for backward compatibility
export default {
  ATTRACT,
  WAIT_FOR_ENEMY,
  COMBAT,
  WAIT_FOR_PORTAL,
  WARP,
  PLAYER_HIT,
  GAME_OVER,
  get current() { return current; },
  set current(value) { current = value; },
  get actors() { return actors; },
  set actors(value) { actors = value; },
  get enemiesRemaining() { return enemiesRemaining; },
  set enemiesRemaining(value) { enemiesRemaining = value; },
  get isPaused() { return isPaused; },
  set isPaused(value) { isPaused = value; },
  get score() { return score; },
  set score(value) { score = value; },
  getCurrent,
  getActors,
  getEnemiesRemaining,
  getIsPaused,
  getScore,
  setCurrent,
  setIsPaused,
  setScore,
  init,
  initLevel,
  resetEnemyCounter,
  setupAttract,
  setupWaitForEnemy,
  setupWaitForPortal,
  setupCombat,
  setupPlayerHitInCombat,
  setupGameOver,
  setupWarp,
  enemyKilled,
  updateWaitForEnemy,
  updateWaitForPortal,
  updateCombat,
  updatePlayerHitInCombat,
  updateGameOver,
  performNormalLevelUpdates,
  update
};
