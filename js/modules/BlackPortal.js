'use strict';

import { Portal, STATE_OPENING, STATE_CLOSING } from './Portal.js';
import * as C64 from './C64.js';
import Encounter from './Encounter.js';
import { randomLocationCloseToPlayer as Grid_randomLocationCloseToPlayer } from './Grid.js';
import { log, panic } from './UTIL.js';
import { getClock } from './MY3.js';
import { resetEnemyCounter, setupWaitForEnemy, setupWarp } from './State.js';
import { getPosition as Player_getPosition } from './Player.js';

const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.black });

// Additional states for black portals
export const STATE_WAITING_TO_SPAWN = 'waitingToSpawn';
export const STATE_WAITING_FOR_PLAYER = 'waitingForPlayer';
export const STATE_PLAYER_ENTERED = 'playerEntered';

export class BlackPortal extends Portal {
  constructor() {
    const mesh = new window.THREE.Mesh(Portal.GEOMETRY, MATERIAL);
    super(mesh);
    this.wasOpenedAt = null;
    this.spawnTimerStartedAt = null;
  }

  startSpawnTimer() {
    log('started portal spawn timer');
    this.spawnTimerStartedAt = getClock().oldTime;
    this.state = STATE_WAITING_TO_SPAWN;
  }

  spawnIfReady() {
    if ((getClock().oldTime - this.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS) {
      const location = Grid_randomLocationCloseToPlayer(Encounter.PORTAL_SPAWN_DISTANCE_MAX);
      this.spawn(location);
    }
  }

  updateWaitingForPlayer(timeDeltaMillis) {
    if (Player_getPosition().distanceTo(this.mesh.position) < 70) {
      this.state = STATE_PLAYER_ENTERED;
      // Portal cleanup is done in Warp
    } else if ((getClock().oldTime - this.wasOpenedAt) > Encounter.TIME_TO_ENTER_PORTAL_MS) {
      log('player failed to enter portal, closing');
      this.startClosing();
    }
  }

  opened() {
    this.wasOpenedAt = getClock().oldTime;
    this.state = STATE_WAITING_FOR_PLAYER;
  }

  closed() {
    resetEnemyCounter();
    setupWaitForEnemy();
  }

  update(timeDeltaMillis) {
    switch (this.state) {
      case STATE_WAITING_TO_SPAWN:
        this.spawnIfReady();
        break;
      case STATE_OPENING:
        this.updateOpening(timeDeltaMillis);
        break;
      case STATE_WAITING_FOR_PLAYER:
        this.updateWaitingForPlayer(timeDeltaMillis);
        break;
      case STATE_PLAYER_ENTERED:
        this.state = null; // lifecycle of this portal is over, despite being open
        setupWarp();
        break;
      case STATE_CLOSING:
        this.updateClosing(timeDeltaMillis);
        break;
      case null:
        // Portal has closed and will be removed from actors list
        break;
      default:
        panic('unknown BlackPortal state: ' + this.state);
    }
  }

  // Dummy actor update function - BlackPortal is updated as a top-level State
  getActorUpdateFunction() {
    return function() {};
  }
}

// Singleton instance
let instance = null;

export function init() {
  instance = new BlackPortal();
}

export function startSpawnTimer() {
  if (!instance) {
    instance = new BlackPortal();
  }
  instance.startSpawnTimer();
}

export function update(timeDeltaMillis) {
  if (instance) {
    instance.update(timeDeltaMillis);
  }
}

export function removeFromScene() {
  if (instance) {
    instance.removeFromScene();
  }
}

// Export default object for backward compatibility
export default {
  MATERIAL,
  STATE_WAITING_TO_SPAWN,
  STATE_WAITING_FOR_PLAYER,
  STATE_PLAYER_ENTERED,
  init,
  startSpawnTimer,
  update,
  removeFromScene
};
