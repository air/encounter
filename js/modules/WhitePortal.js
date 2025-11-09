'use strict';

import * as Portal from './Portal.js';
import * as C64 from './C64.js';
import Encounter from './Encounter.js';
import { randomLocationCloseToPlayer as Grid_randomLocationCloseToPlayer } from './Grid.js';
import { log, panic } from './UTIL.js';
import { TYPE_PORTAL as Radar_TYPE_PORTAL, TYPE_NONE as Radar_TYPE_NONE } from './Radar.js';
import { spawnGivenTypeAt as Enemy_spawnGivenTypeAt } from './Enemy.js';

// WhitePortal extends Portal functionality
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.white });

// additional state for white portals
let enemyTypeIncoming = null;
let actor = null;

export function init() {
  Portal.setMesh(new window.THREE.Mesh(Portal.GEOMETRY, MATERIAL));
}

export function getActorUpdateFunction() {
  var update = function(timeDeltaMillis) {
    switch(Portal.state) {
      case Portal.STATE_OPENING:
        Portal.updateOpening.call({ spawnedAt: Portal.spawnedAt, opened, removeFromScene: Portal.removeFromScene, state: Portal.state, closed: () => {} }, timeDeltaMillis);
        break;
      case Portal.STATE_CLOSING:
        Portal.updateClosing.call({ closeStartedAt: Portal.closeStartedAt, removeFromScene: Portal.removeFromScene, state: Portal.state, closed: () => {} }, timeDeltaMillis);
        break;
      default:
        panic('unknown WhitePortal state: ' + Portal.state);
    }
  };
  return update;
}

export function spawnForEnemy(enemyType) {
  enemyTypeIncoming = enemyType;
  log('spawning white portal with enemy type: ' + enemyTypeIncoming);

  // FIXME: Awkward loss of inheritance from ES6 conversion. Old code used Object.create(Portal)
  // so WhitePortal.spawn() would automatically use WhitePortal's own mesh/state/actor via 'this'.
  // Now we manually bind context with .call() which is fragile and loses the elegant prototype chain.
  // Consider refactoring Portal/WhitePortal/BlackPortal to use proper ES6 classes or composition pattern.
  var location = Grid_randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
  Portal.spawn.call({ mesh: Portal.mesh, spawnedAt: Portal.spawnedAt, state: Portal.state, actor, getActorUpdateFunction }, location);
  Portal.mesh.radarType = Radar_TYPE_PORTAL;
}

export function opened() {
  Enemy_spawnGivenTypeAt(enemyTypeIncoming, Portal.mesh.position);
  actor.radarType = Radar_TYPE_NONE;
  Portal.startClosing.call({ mesh: Portal.mesh, state: Portal.state, closeStartedAt: Portal.closeStartedAt });
}

// Export default object for backward compatibility
export default {
  MATERIAL,
  get mesh() { return Portal.mesh; },
  set mesh(value) { Portal.mesh = value; },
  get state() { return Portal.state; },
  set state(value) { Portal.state = value; },
  get actor() { return actor; },
  set actor(value) { actor = value; },
  get enemyTypeIncoming() { return enemyTypeIncoming; },
  set enemyTypeIncoming(value) { enemyTypeIncoming = value; },
  init,
  getActorUpdateFunction,
  spawnForEnemy,
  opened
};