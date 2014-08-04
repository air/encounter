'use strict';

// Abstract prototype for all saucer enemies:
//   - shoot() is undefined.

var Saucer = new THREE.Mesh();

Saucer.RADIUS = 70;
Saucer.GEOMETRY = new THREE.SphereGeometry(Saucer.RADIUS, 8, 2);
Saucer.MESH_SCALE_Y = 0.6;

// Player speed is Encounter.MOVEMENT_SPEED
Saucer.MOVEMENT_SPEED = 1.0;

Saucer.STATE_MOVING = 'moving';
Saucer.STATE_WAITING = 'waiting';
Saucer.STATE_SHOT_WINDUP = 'shotWindup';
Saucer.STATE_SHOOTING = 'shooting';

Saucer.MOVE_TIME_MAX_MS = 5000;
Saucer.MOVE_TIME_MIN_MS = 1000;
Saucer.WAIT_TIME_MAX_MS = 2000;
Saucer.WAIT_TIME_MIN_MS = 1000;

Saucer.SHOT_WINDUP_TIME_MS = 600;
Saucer.SHOTS_TO_FIRE = 1;
Saucer.SHOT_INTERVAL_MS = 800; // only relevant if SHOTS_TO_FIRE > 1 

Saucer.radarType = Radar.TYPE_ENEMY;

Saucer.init = function()
{
  // not strictly necessary to init these but it gives an indication of what state we need
  Saucer.state = null;
  Saucer.movingCountdown = null;
  Saucer.waitingCountdown = null;
  Saucer.shotWindupCountdown = null;
  Saucer.shotIntervalCountdown = null;
  Saucer.shotsLeftToFire = null;
};

Saucer.spawn = function()
{
  Indicators.setYellow(true);

  var spawnPoint = Grid.randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
  spawnPoint.y = Encounter.CAMERA_HEIGHT;
  log('spawning saucer at ' + spawnPoint.x + ', ' + spawnPoint.y + ', ' + spawnPoint.z);
  this.position.copy(spawnPoint);

  this.setupMoving();

  return this;
};

Saucer.setupWaiting = function()
{
  this.waitingCountdown = UTIL.random(Saucer.WAIT_TIME_MIN_MS, Saucer.WAIT_TIME_MAX_MS);
  log('enemy waiting for ' + this.waitingCountdown + 'ms');
  Sound.saucerWait(this.waitingCountdown);
  this.state = Saucer.STATE_WAITING;
};

Saucer.updateWaiting = function(timeDeltaMillis)
{
  this.waitingCountdown -= timeDeltaMillis;
  if (this.waitingCountdown <= 0)
  {
    this.setupMoving();
  }
  else
  {
    // FIXME delegate AI to subclass
    if (UTIL.random(50) === 42)
    {
      this.setupShotWindup();
    }
  }
};

Saucer.setupShotWindup = function()
{
  this.shotWindupCountdown = Saucer.SHOT_WINDUP_TIME_MS;
  Sound.shotWindup();
  log('enemy winding up shot for ' + Saucer.SHOT_WINDUP_TIME_MS + 'ms');
  this.state = Saucer.STATE_SHOT_WINDUP;
};

Saucer.setupShooting = function()
{
  log('enemy shooting');
  // we will always shoot immediately after the windup, so might as well do it here
  this.shoot();
  Indicators.setBlue(true);

  if (this.SHOTS_TO_FIRE > 1)
  {
    this.shotsLeftToFire = this.SHOTS_TO_FIRE - 1;  // read from 'this' not Saucer so we can override in subclass
    this.shotIntervalCountdown = Saucer.SHOT_INTERVAL_MS;
    this.state = Saucer.STATE_SHOOTING;
  }
  else
  {
    this.setupMoving();
  }
};

Saucer.setupMoving = function()
{
  this.movingCountdown = UTIL.random(Saucer.MOVE_TIME_MIN_MS, Saucer.MOVE_TIME_MAX_MS);
  this.rotation.y = MY3.randomDirection();
  log('enemy moving for ' + this.movingCountdown + 'ms in direction ' + this.rotation.y);
  Sound.saucerMove(this.movingCountdown);
  this.state = Saucer.STATE_MOVING;
};

Saucer.updateShotWindup = function(timeDeltaMillis)
{
  this.shotWindupCountdown -= timeDeltaMillis;
  if (this.shotWindupCountdown <= 0)
  {
    this.setupShooting();
  }
};

Saucer.updateShooting = function(timeDeltaMillis)
{
  this.shotIntervalCountdown -= timeDeltaMillis;

  if (this.shotIntervalCountdown <= 0)
  {
    this.shoot();
    this.shotsLeftToFire -= 1;
    this.shotIntervalCountdown = Saucer.SHOT_INTERVAL_MS;
  }

  if (this.shotsLeftToFire <= 0)
  {
    this.setupMoving();
  }
};

Saucer.updateMoving = function(timeDeltaMillis)
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
      var collidePosition = Physics.isCollidingWithObelisk(this.position, Saucer.RADIUS);
      // if we get a return there is work to do
      if (typeof collidePosition !== 'undefined')
      {
        // we have a collision, move the Saucer out but don't change the rotation
        Physics.moveCircleOutOfStaticCircle(collidePosition, Obelisk.RADIUS, this.position, Saucer.RADIUS);
        Sound.playerCollideObelisk();
      }
    }
  }
  else
  {
    this.setupWaiting();
  }
};

Saucer.destroyed = function()
{
  Indicators.setYellow(false);
};

Saucer.update = function(timeDeltaMillis)
{
  switch(this.state)
  {
    case Saucer.STATE_WAITING:
      this.updateWaiting(timeDeltaMillis);
      break;
    case Saucer.STATE_MOVING:
      this.updateMoving(timeDeltaMillis);
      break;
    case Saucer.STATE_SHOT_WINDUP:
      this.updateShotWindup(timeDeltaMillis);
      break;
    case Saucer.STATE_SHOOTING:
      this.updateShooting(timeDeltaMillis);
      break;
    default:
      error('unknown Saucer state: ' + this.state);
  } 
};
