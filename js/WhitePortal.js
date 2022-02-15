import { log, error, panic } from '/js/UTIL.js';
import * as Portal from '/js/Portal.js'
import * as THREE from '/lib/three.module.js'
import * as C64 from '/js/C64.js'
import * as Grid from '/js/Grid.js'
import * as Encounter from '/js/Encounter.js'
import * as Radar from '/js/Radar.js'
import * as Enemy from '/js/Enemy.js'

export const MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white });

export class WhitePortal extends Portal
{
  constructor()
  {
    super();
    this.mesh = new THREE.Mesh(Portal.GEOMETRY, MATERIAL);
    // additional state for white portals
    this.enemyTypeIncoming = null;
  }

  getActorUpdateFunction()
  {
    return function(timeDeltaMillis)
    {
      switch(this.state)
      {
        case STATE_OPENING:
          this.updateOpening(timeDeltaMillis);
          break;
        case STATE_CLOSING:
          this.updateClosing(timeDeltaMillis);
          break;
        default:
          panic('unknown WhitePortal state: ' + this.state);
      }
    };
  }

  spawnForEnemy(enemyType)
  {
    this.enemyTypeIncoming = enemyType;
    log('spawning white portal with enemy type: ' + this.enemyTypeIncoming);

    var location = Grid.randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
    this.spawn(location);
    this.mesh.radarType = Radar.TYPE_PORTAL;
  };

  opened()
  {
    Enemy.spawnGivenTypeAt(this.enemyTypeIncoming, this.mesh.position);
    this.actor.radarType = Radar.TYPE_NONE;
    this.startClosing();
  };
}
