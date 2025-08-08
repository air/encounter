'use strict';

import * as Portal from './Portal.js';
import * as C64 from './C64.js';
import Encounter from './Encounter.js';
import Grid from './Grid.js';
import { log } from './UTIL.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Enemy = {
  spawnGivenTypeAt: (type, position) => console.log('Enemy.spawnGivenTypeAt called:', type, 'at position:', position)
};

const Radar = {
  TYPE_PORTAL: 'portal',
  TYPE_NONE: 'none'
};

// WhitePortal extends Portal functionality
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.white });

// additional state for white portals
let enemyTypeIncoming = null;
let mesh = null;
let actor = null;

export function init() {
  Portal.init(); // Initialize base portal geometry
  mesh = new window.THREE.Mesh(Portal.getGeometry(), MATERIAL);
}

export function getActorUpdateFunction() {
  var update = function(timeDeltaMillis) {
    const currentState = Portal.getState();
    switch(currentState) {
      case Portal.STATE_OPENING:
        updateOpening(timeDeltaMillis);
        break;
      case Portal.STATE_CLOSING:
        updateClosing(timeDeltaMillis);
        break;
      default:
        if (currentState !== null) {
          throw new Error('unknown WhitePortal state: ' + currentState);
        }
    }
  };
  return update;
}

export function spawnForEnemy(enemyType) {
  enemyTypeIncoming = enemyType;
  log('spawning white portal with enemy type: ' + enemyTypeIncoming);

  var location = Grid.randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
  spawn(location);
  mesh.radarType = Radar.TYPE_PORTAL;
}

export function spawn(location) {
  // Set our mesh in the Portal module before spawning
  Portal.setMesh(mesh);
  Portal.spawn(location);
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
}

export function startClosing() {
  Portal.setMesh(mesh);
  Portal.startClosing();
}

export function opened() {
  Enemy.spawnGivenTypeAt(enemyTypeIncoming, mesh.position);
  if (actor) {
    actor.radarType = Radar.TYPE_NONE;
  }
  startClosing();
}

export function removeFromScene() {
  Portal.setMesh(mesh);
  Portal.removeFromScene();
}

// Getters and setters for module state
export function getEnemyTypeIncoming() { return enemyTypeIncoming; }
export function setEnemyTypeIncoming(type) { enemyTypeIncoming = type; }
export function getMesh() { return mesh; }
export function setMesh(newMesh) { mesh = newMesh; }
export function getActor() { return actor; }
export function setActor(newActor) { actor = newActor; }

// Export default object for backward compatibility
export default {
  MATERIAL,
  get enemyTypeIncoming() { return enemyTypeIncoming; },
  set enemyTypeIncoming(value) { enemyTypeIncoming = value; },
  get mesh() { return mesh; },
  set mesh(value) { mesh = value; },
  get actor() { return actor; },
  set actor(value) { actor = value; },
  init,
  getActorUpdateFunction,
  spawnForEnemy,
  spawn,
  updateOpening,
  updateClosing,
  startClosing,
  opened,
  removeFromScene,
  getEnemyTypeIncoming,
  setEnemyTypeIncoming,
  getMesh,
  setMesh,
  getActor,
  setActor
};