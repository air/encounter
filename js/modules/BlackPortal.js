'use strict';

import * as Portal from './Portal.js';
import * as C64 from './C64.js';
import Encounter from './Encounter.js';
import { randomLocationCloseToPlayer as Grid_randomLocationCloseToPlayer } from './Grid.js';
import { log, panic } from './UTIL.js';
import { getClock } from './MY3.js';

// CLAUDE-TODO: Replace with actual Player import when Player.js is converted to ES6 module
const Player = {
  position: { x: 0, y: 0, z: 0, distanceTo: () => 0 }
};

// CLAUDE-TODO: Replace with actual State import when State.js is converted to ES6 module
const State = {
  resetEnemyCounter: () => {},
  setupWaitForEnemy: () => {},
  setupWarp: () => {}
};

// BlackPortal extends Portal functionality
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.black });

// additional states for black portals
export const STATE_WAITING_TO_SPAWN = 'waitingToSpawn';
export const STATE_WAITING_FOR_PLAYER = 'waitingForPlayer';
export const STATE_PLAYER_ENTERED = 'playerEntered';

// additional state for black portals
let wasOpenedAt = null;
let spawnTimerStartedAt = null;

export function init() {
  Portal.setMesh(new window.THREE.Mesh(Portal.GEOMETRY, MATERIAL));
}

// dummy actor update, we handle updates as a top-level State
export function getActorUpdateFunction() {
  var update = function(){};
  return update;
}

export function startSpawnTimer() {
  log('started portal spawn timer');
  spawnTimerStartedAt = getClock().oldTime;
  Portal.state = STATE_WAITING_TO_SPAWN;
}

export function spawnIfReady() {
  if ((getClock().oldTime - spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS) {
    var location = Grid_randomLocationCloseToPlayer(Encounter.PORTAL_SPAWN_DISTANCE_MAX);
    Portal.spawn.call({ mesh: Portal.mesh, spawnedAt: Portal.spawnedAt, state: Portal.state, actor: null, getActorUpdateFunction });
  }
}

export function updateWaitingForPlayer(timeDeltaMillis) {
  if (Player.position.distanceTo(Portal.mesh.position) < 70) {
    Portal.state = STATE_PLAYER_ENTERED;
    // Portal cleanup is done in Warp
  } else if ((getClock().oldTime - wasOpenedAt) > Encounter.TIME_TO_ENTER_PORTAL_MS) {
    log('player failed to enter portal, closing');
    Portal.startClosing.call({ mesh: Portal.mesh, state: Portal.state, closeStartedAt: Portal.closeStartedAt });
  }
}

export function opened() {
  wasOpenedAt = getClock().oldTime;
  Portal.state = STATE_WAITING_FOR_PLAYER;
}

export function closed() {
  State.resetEnemyCounter();
  State.setupWaitForEnemy();
}

export function update(timeDeltaMillis) {
  switch (Portal.state) {
    case STATE_WAITING_TO_SPAWN:
      spawnIfReady();
      break;
    case Portal.STATE_OPENING:
      Portal.updateOpening.call({ spawnedAt: Portal.spawnedAt, opened, removeFromScene: Portal.removeFromScene, state: Portal.state, closed }, timeDeltaMillis);
      break;
    case STATE_WAITING_FOR_PLAYER:
      updateWaitingForPlayer(timeDeltaMillis);
      break;
    case STATE_PLAYER_ENTERED:
      Portal.state = null; // lifecycle of this portal is over, despite being open
      State.setupWarp();
      break;
    case Portal.STATE_CLOSING:
      Portal.updateClosing.call({ closeStartedAt: Portal.closeStartedAt, state: Portal.state, removeFromScene: Portal.removeFromScene, closed }, timeDeltaMillis);
      break;
    default:
      panic('unknown BlackPortal state: ' + Portal.state);
  }
}

export function removeFromScene() {
  Portal.removeFromScene.call({ actor: null });
}

// Export default object for backward compatibility
export default {
  MATERIAL,
  STATE_WAITING_TO_SPAWN,
  STATE_WAITING_FOR_PLAYER,
  STATE_PLAYER_ENTERED,
  get mesh() { return Portal.mesh; },
  set mesh(value) { Portal.mesh = value; },
  get state() { return Portal.state; },
  set state(value) { Portal.state = value; },
  get wasOpenedAt() { return wasOpenedAt; },
  set wasOpenedAt(value) { wasOpenedAt = value; },
  get spawnTimerStartedAt() { return spawnTimerStartedAt; },
  set spawnTimerStartedAt(value) { spawnTimerStartedAt = value; },
  init,
  getActorUpdateFunction,
  startSpawnTimer,
  spawnIfReady,
  updateWaitingForPlayer,
  opened,
  closed,
  update,
  removeFromScene
};