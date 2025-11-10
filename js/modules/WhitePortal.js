'use strict';

import { Portal, STATE_OPENING, STATE_CLOSING } from './Portal.js';
import * as C64 from './C64.js';
import Encounter from './Encounter.js';
import { randomLocationCloseToPlayer as Grid_randomLocationCloseToPlayer } from './Grid.js';
import { log, panic } from './UTIL.js';
import { TYPE_PORTAL as Radar_TYPE_PORTAL, TYPE_NONE as Radar_TYPE_NONE } from './Radar.js';
import { spawnGivenTypeAt as Enemy_spawnGivenTypeAt } from './Enemy.js';

const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.white });

export class WhitePortal extends Portal {
  constructor() {
    const mesh = new window.THREE.Mesh(Portal.GEOMETRY, MATERIAL);
    super(mesh);
    this.enemyTypeIncoming = null;
  }

  spawnForEnemy(enemyType) {
    this.enemyTypeIncoming = enemyType;
    log('spawning white portal with enemy type: ' + this.enemyTypeIncoming);

    const location = Grid_randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
    this.spawn(location);
    this.mesh.radarType = Radar_TYPE_PORTAL;
  }

  opened() {
    Enemy_spawnGivenTypeAt(this.enemyTypeIncoming, this.mesh.position);
    this.actor.radarType = Radar_TYPE_NONE;
    this.startClosing();
  }

  getActorUpdateFunction() {
    return (timeDeltaMillis) => {
      switch(this.state) {
        case STATE_OPENING:
          this.updateOpening(timeDeltaMillis);
          break;
        case STATE_CLOSING:
          this.updateClosing(timeDeltaMillis);
          break;
        case null:
          // Portal has closed and will be removed from actors list
          break;
        default:
          panic('unknown WhitePortal state: ' + this.state);
      }
    };
  }
}

// Singleton instance
let instance = null;

export function init() {
  // Create instance when init is called, but Portal.GEOMETRY must exist first
  instance = new WhitePortal();
}

export function spawnForEnemy(enemyType) {
  if (!instance) {
    instance = new WhitePortal();
  }
  instance.spawnForEnemy(enemyType);
}

// Export default object for backward compatibility
export default {
  MATERIAL,
  init,
  spawnForEnemy
};
