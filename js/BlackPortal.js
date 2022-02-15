import { log, error, panic } from '/js/UTIL.js';
import * as Portal from '/js/Portal.js'
import * as THREE from '/lib/three.module.js'
import * as C64 from '/js/C64.js'
import * as MY3 from '/js/MY3.js'

export const MATERIAL = new THREE.MeshBasicMaterial({ color: C64.black });
// additional states for black portals
export const STATE_WAITING_TO_SPAWN = 'waitingToSpawn';
export const STATE_WAITING_FOR_PLAYER = 'waitingForPlayer';
export const STATE_PLAYER_ENTERED = 'playerEntered';

export class BlackPortal extends Portal
{
  constructor()
  {
    super();
    this.mesh = new THREE.Mesh(Portal.GEOMETRY, MATERIAL);
    // additional state for black portals
    this.wasOpenedAt = null;
    this.spawnTimerStartedAt = null;
  }

  startSpawnTimer()
  {
    log('started portal spawn timer');
    this.spawnTimerStartedAt = MY3.clock.oldTime;
    this.state = STATE_WAITING_TO_SPAWN;
  };

  spawnIfReady()
  {
    if ((MY3.clock.oldTime - this.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
    {
      var location = Grid.randomLocationCloseToPlayer(Encounter.PORTAL_SPAWN_DISTANCE_MAX);
      this.spawn(location);
    }
  };

  updateWaitingForPlayer(timeDeltaMillis)
  {
    if (Player.position.distanceTo(this.mesh.position) < 70)
    {
      this.state = STATE_PLAYER_ENTERED;
      // Portal cleanup is done in Warp
    }
    else if ((MY3.clock.oldTime - this.wasOpenedAt) > Encounter.TIME_TO_ENTER_PORTAL_MS)
    {
      log('player failed to enter portal, closing');
      this.startClosing();
    }
  };

  opened()
  {
    this.wasOpenedAt = MY3.clock.oldTime;
    this.state = STATE_WAITING_FOR_PLAYER;
  };

  closed()
  {
    State.resetEnemyCounter();
    State.setupWaitForEnemy();
  };

  update(timeDeltaMillis)
  {
    switch (this.state)
    {
      case STATE_WAITING_TO_SPAWN:
        this.spawnIfReady();
        break;
      case Portal.STATE_OPENING:
        this.updateOpening(timeDeltaMillis);
        break;
      case STATE_WAITING_FOR_PLAYER:
        this.updateWaitingForPlayer(timeDeltaMillis);
        break;
      case STATE_PLAYER_ENTERED:
        this.state = null; // lifecycle of this portal is over, despite being open
        State.setupWarp();
        break;
      case Portal.STATE_CLOSING:
        this.updateClosing(timeDeltaMillis);
        break;
      default:
        panic('unknown BlackPortal state: ' + this.state);
    }
  }

  // dummy actor update, we handle updates as a top-level State
  getActorUpdateFunction()
  {
    return function(){};
  }
}
