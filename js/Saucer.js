'use strict';

// Abstract class for all saucer enemies.

var Saucer = {};

Saucer.RADIUS = 40;
Saucer.GEOMETRY = new THREE.SphereGeometry(Saucer.RADIUS, 8, 4);
Saucer.MESH_SCALE_Y = 0.4;

// Player speed is Encounter.MOVEMENT_SPEED
Saucer.MOVEMENT_SPEED = 0.8;

Saucer.STATE_MOVING = 'moving';
Saucer.STATE_WAITING = 'waiting';

Saucer.MOVE_TIME_MAX_MS = 5000;
Saucer.MOVE_TIME_MIN_MS = 1000;
Saucer.WAIT_TIME_MAX_MS = 2000;
Saucer.WAIT_TIME_MIN_MS = 1000;

Saucer.newInstance = function()
{
  var newSaucer = new THREE.Mesh(); // initially a default mesh, we'll define this in the subclass

  newSaucer.radarType = Radar.TYPE_ENEMY;

  newSaucer.state = null;
  newSaucer.movingCountdown = null;
  newSaucer.waitingCountdown = null;

  newSaucer.spawn = function()
  {
    var spawnPoint = Grid.randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
    spawnPoint.y = Encounter.CAMERA_HEIGHT;
    log('spawning saucer at ' + spawnPoint.x + ', ' + spawnPoint.y + ', ' + spawnPoint.z);
    this.position.copy(spawnPoint);

    this.setupMoving();

    return this;
  }

  newSaucer.setupWaiting = function()
  {
    this.waitingCountdown = UTIL.random(Saucer.WAIT_TIME_MIN_MS, Saucer.WAIT_TIME_MAX_MS);
    log('enemy waiting for ' + this.waitingCountdown + 'ms');
    this.state = Saucer.STATE_WAITING;
  }

  newSaucer.updateWaiting = function(timeDeltaMillis)
  {
    this.waitingCountdown -= timeDeltaMillis;
    if (this.waitingCountdown <= 0)
    {
      this.setupMoving();
    }
    else
    {
      if (UTIL.random(50) == 42)
      {
        MY3.rotateObjectToLookAt(this, Player.position);
        this.shoot();
        this.setupMoving();
      }
    }
  }

  newSaucer.setupMoving = function()
  {
    this.movingCountdown = UTIL.random(Saucer.MOVE_TIME_MIN_MS, Saucer.MOVE_TIME_MAX_MS);
    this.rotation.y = MY3.randomDirection();
    log('enemy moving for ' + this.movingCountdown + 'ms in direction ' + this.rotation.y);
    this.state = Saucer.STATE_MOVING;
  }

  newSaucer.updateMoving = function(timeDeltaMillis)
  {
    this.movingCountdown -= timeDeltaMillis;
    if (this.movingCountdown > 0)
    {
      var actualMoveSpeed = timeDeltaMillis * Saucer.MOVEMENT_SPEED;
      this.translateZ(-actualMoveSpeed);

      // if an obelisk is close (fast check), do a detailed collision check
      if (Physics.isCloseToAnObelisk(this.position, Saucer.RADIUS))
      {
        // check for precise collision
        var obelisk = Physics.getCollidingObelisk(this.position, Saucer.RADIUS);
        // if we get a return there is work to do
        if (typeof obelisk !== "undefined")
        {
          // we have a collision, move the Saucer out but don't change the rotation
          Physics.moveCircleOutOfStaticCircle(obelisk.position, Obelisk.RADIUS, this.position, Saucer.RADIUS);
          Sound.playerCollideObelisk();
        }
      }
    }
    else
    {
      this.setupWaiting();
    }
  }

  newSaucer.update = function(timeDeltaMillis)
  {
    switch(this.state)
    {
      case Saucer.STATE_WAITING:
        this.updateWaiting(timeDeltaMillis);
        break;
      case Saucer.STATE_MOVING:
        this.updateMoving(timeDeltaMillis);
        break;
      default:
        error('unknown Saucer state: ' + this.state);
    } 
  }

  return newSaucer;
}
