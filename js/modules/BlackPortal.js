'use strict';

import * as Portal from './Portal.js';
import * as C64 from './C64.js';
import Encounter from './Encounter.js';
import Grid from './Grid.js';
import { log } from './UTIL.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Player = {
  position: { 
    x: 0, y: 0, z: 0,
    distanceTo: (other) => {
      const dx = Player.position.x - other.x;
      const dz = Player.position.z - other.z;
      return Math.sqrt(dx * dx + dz * dz);
    }
  }
};

const State = {
  resetEnemyCounter: () => console.log('State.resetEnemyCounter called'),
  setupWaitForEnemy: () => console.log('State.setupWaitForEnemy called'),
  setupWarp: () => console.log('State.setupWarp called')
};

const clock = {
  oldTime: 0
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
let mesh = null;
let state = null;

export function init() {
  Portal.init(); // Initialize base portal geometry
  mesh = new window.THREE.Mesh(Portal.getGeometry(), MATERIAL);
}

// dummy actor update, we handle updates as a top-level State
export function getActorUpdateFunction() {
  var update = function(){};
  return update;
}

export function startSpawnTimer() {
  log('started portal spawn timer');
  spawnTimerStartedAt = clock.oldTime;
  state = STATE_WAITING_TO_SPAWN;
}

export function spawnIfReady() {
  if ((clock.oldTime - spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS) {
    var location = Grid.randomLocationCloseToPlayer(Encounter.PORTAL_SPAWN_DISTANCE_MAX);
    spawn(location);
  }
}

export function spawn(location) {
  // Set our mesh in the Portal module before spawning
  Portal.setMesh(mesh);
  Portal.spawn(location);
  // Copy state back
  state = Portal.getState();
}

export function updateWaitingForPlayer(timeDeltaMillis) {
  if (Player.position.distanceTo(mesh.position) < 70) {
    state = STATE_PLAYER_ENTERED;
    // Portal cleanup is done in Warp
  } else if ((clock.oldTime - wasOpenedAt) > Encounter.TIME_TO_ENTER_PORTAL_MS) {
    log('player failed to enter portal, closing');
    startClosing();
  }
}

export function startClosing() {
  Portal.setMesh(mesh);
  Portal.startClosing();
  state = Portal.getState();
}

export function opened() {
  wasOpenedAt = clock.oldTime;
  state = STATE_WAITING_FOR_PLAYER;
}

export function closed() {
  State.resetEnemyCounter();
  State.setupWaitForEnemy();
}

export function updateOpening(timeDeltaMillis) {
  Portal.setMesh(mesh);
  Portal.updateOpening(timeDeltaMillis);
  // Check if portal opened
  if (Portal.getState() !== Portal.STATE_OPENING) {
    opened();
  }
}

export function updateClosing(timeDeltaMillis) {
  Portal.setMesh(mesh);
  Portal.updateClosing(timeDeltaMillis);
  // Check if portal closed
  if (Portal.getState() === null) {
    closed();
  }
}

export function update(timeDeltaMillis) {
  switch (state) {
    case STATE_WAITING_TO_SPAWN:
      spawnIfReady();
      break;
    case Portal.STATE_OPENING:
      updateOpening(timeDeltaMillis);
      break;
    case STATE_WAITING_FOR_PLAYER:
      updateWaitingForPlayer(timeDeltaMillis);
      break;
    case STATE_PLAYER_ENTERED:
      state = null; // lifecycle of this portal is over, despite being open
      State.setupWarp();
      break;
    case Portal.STATE_CLOSING:
      updateClosing(timeDeltaMillis);
      break;
    default:
      if (state !== null) {
        throw new Error('unknown BlackPortal state: ' + state);
      }
  }
}

export function removeFromScene() {
  Portal.setMesh(mesh);
  Portal.removeFromScene();
}

// Getters and setters for module state
export function getMesh() { return mesh; }
export function setMesh(newMesh) { mesh = newMesh; }
export function getState() { return state; }
export function setState(newState) { state = newState; }
export function getWasOpenedAt() { return wasOpenedAt; }
export function setWasOpenedAt(time) { wasOpenedAt = time; }
export function getSpawnTimerStartedAt() { return spawnTimerStartedAt; }
export function setSpawnTimerStartedAt(time) { spawnTimerStartedAt = time; }

// Export default object for backward compatibility
export default {
  MATERIAL,
  STATE_WAITING_TO_SPAWN,
  STATE_WAITING_FOR_PLAYER,
  STATE_PLAYER_ENTERED,
  get wasOpenedAt() { return wasOpenedAt; },
  set wasOpenedAt(value) { wasOpenedAt = value; },
  get spawnTimerStartedAt() { return spawnTimerStartedAt; },
  set spawnTimerStartedAt(value) { spawnTimerStartedAt = value; },
  get mesh() { return mesh; },
  set mesh(value) { mesh = value; },
  get state() { return state; },
  set state(value) { state = value; },
  init,
  getActorUpdateFunction,
  startSpawnTimer,
  spawnIfReady,
  spawn,
  updateWaitingForPlayer,
  startClosing,
  opened,
  closed,
  updateOpening,
  updateClosing,
  update,
  removeFromScene,
  getMesh,
  setMesh,
  getState,
  setState,
  getWasOpenedAt,
  setWasOpenedAt,
  getSpawnTimerStartedAt,
  setSpawnTimerStartedAt
};