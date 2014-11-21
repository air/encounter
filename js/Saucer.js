'use strict';

// Saucer is an abstract type. Derived objects must implement:
// - shoot()

// constructor for new. Material is required, location is optional.
var Saucer = function(material, location)
{
  if (typeof material === 'undefined')
  {
    panic('Saucer must be provided a material');
  }

  this.mesh = new THREE.Mesh(Saucer.GEOMETRY, material);
  this.mesh.scale.y = Saucer.MESH_SCALE_Y;

  if (typeof location !== 'undefined')
  {
    this.mesh.position.copy(location);
  }

  // update is a closure passed over to Actor and invoked there, so we need 'self' to track the owning Saucer instance
  var self = this;
  var update = function(timeDeltaMillis)
  {
    if (typeof self === 'undefined')
    {
      panic('Saucer: self is undefined, wtf', this)
    }

    if (typeof self.state === 'undefined')
    {
      panic('Saucer: self.state is undefined, wtf', self);
    }

    // things we do regardless of state
    if (self.mesh.material instanceof MY3.FlickeringBasicMaterial)
    {
      self.mesh.material.tick();
    }

    switch(self.state)
    {
      case Saucer.STATE_WAITING:
        self.updateWaiting(timeDeltaMillis);
        break;
      case Saucer.STATE_MOVING:
        self.updateMoving(timeDeltaMillis);
        break;
      case Saucer.STATE_SHOT_WINDUP:
        self.updateShotWindup(timeDeltaMillis);
        break;
      case Saucer.STATE_SHOOTING:
        self.updateShooting(timeDeltaMillis);
        break;
      default:
        panic('unknown Saucer state: ' + self.state);
    }
  };

  this.actor = new Actor(this.mesh, update, Radar.TYPE_ENEMY);
  return this;
}

// type constants - always referenced as Saucer.FOO
Saucer.RADIUS = 70;
Saucer.GEOMETRY = new THREE.SphereGeometry(Saucer.RADIUS, 8, 2);
Saucer.MESH_SCALE_Y = 0.6;
Saucer.MOVEMENT_SPEED = 1.0;  // Player speed is Encounter.MOVEMENT_SPEED
Saucer.STATE_MOVING = 'moving';
Saucer.STATE_WAITING = 'waiting';
Saucer.STATE_SHOT_WINDUP = 'shotWindup';
Saucer.STATE_SHOOTING = 'shooting';
Saucer.MOVE_TIME_MAX_MS = 5000;
Saucer.MOVE_TIME_MIN_MS = 1000;
Saucer.WAIT_TIME_MAX_MS = 2000;
Saucer.WAIT_TIME_MIN_MS = 1000;

Saucer.prototype = {
  // config defaults. TODO configure at create time
  RADIUS: Saucer.RADIUS,
  PERFORMS_SHOT_WINDUP: true,
  SHOT_WINDUP_TIME_MS: 600,
  SHOTS_TO_FIRE: 1,
  SHOT_INTERVAL_MS: 800, // only relevant if SHOTS_TO_FIRE > 1

  // current state
  mesh: null,
  state: null,
  actor: null,
  movingCountdown: null,
  waitingCountdown: null,
  shotWindupCountdown: null,
  shotIntervalCountdown: null,  // only relevant if SHOTS_TO_FIRE > 1
  shotsLeftToFire: null, // only relevant if SHOTS_TO_FIRE > 1

  setupWaiting: function()
  {
    this.waitingCountdown = UTIL.random(Saucer.WAIT_TIME_MIN_MS, Saucer.WAIT_TIME_MAX_MS);
    log('enemy waiting for ' + this.waitingCountdown + 'ms');
    Sound.saucerWait(this.waitingCountdown);
    this.state = Saucer.STATE_WAITING;
  },

  updateWaiting: function(timeDeltaMillis)
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
        if (this.PERFORMS_SHOT_WINDUP)
        {
          this.setupShotWindup();
        }
        else
        {
          this.setupShooting();
        }
      }
    }
  },

  setupShotWindup: function()
  {
    this.shotWindupCountdown = this.SHOT_WINDUP_TIME_MS;
    Sound.shotWindup();
    log('enemy winding up shot for ' + this.SHOT_WINDUP_TIME_MS + 'ms');
    this.state = Saucer.STATE_SHOT_WINDUP;
  },

  shoot: function()
  {
    panic('Saucer.shoot must be overridden');
  },

  setupShooting: function()
  {
    log('enemy shooting');
    // we will always shoot immediately after the windup, so might as well do it here
    this.shoot();
    Indicators.setBlue(true);

    if (this.SHOTS_TO_FIRE > 1)
    {
      this.shotsLeftToFire = this.SHOTS_TO_FIRE - 1;
      this.shotIntervalCountdown = this.SHOT_INTERVAL_MS;
      this.state = Saucer.STATE_SHOOTING;
    }
    else
    {
      this.setupMoving();
    }
  },

  setupMoving: function()
  {
    this.movingCountdown = UTIL.random(Saucer.MOVE_TIME_MIN_MS, Saucer.MOVE_TIME_MAX_MS);
    this.mesh.rotation.y = MY3.randomDirection();
    log('enemy moving for ' + this.movingCountdown + 'ms in direction ' + this.mesh.rotation.y);
    Sound.saucerMove(this.movingCountdown);
    this.state = Saucer.STATE_MOVING;
  },

  updateShotWindup: function(timeDeltaMillis)
  {
    this.shotWindupCountdown -= timeDeltaMillis;
    if (this.shotWindupCountdown <= 0)
    {
      this.setupShooting();
    }
  },

  updateShooting: function(timeDeltaMillis)
  {
    this.shotIntervalCountdown -= timeDeltaMillis;

    if (this.shotIntervalCountdown <= 0)
    {
      this.shoot();
      this.shotsLeftToFire -= 1;
      this.shotIntervalCountdown = this.SHOT_INTERVAL_MS;
    }

    if (this.shotsLeftToFire <= 0)
    {
      this.setupMoving();
    }
  },

  updateMoving: function(timeDeltaMillis)
  {
    this.movingCountdown -= timeDeltaMillis;
    if (this.movingCountdown > 0)
    {
      var actualMoveSpeed = timeDeltaMillis * Saucer.MOVEMENT_SPEED;
      this.mesh.translateZ(-actualMoveSpeed);

      // if an obelisk is close (fast check), do a detailed collision check
      if (Physics.isCloseToAnObelisk(this.mesh.position, this.RADIUS))
      {
        // check for precise collision
        var collidePosition = Physics.isCollidingWithObelisk(this.mesh.position, this.RADIUS);
        // if we get a return there is work to do
        if (typeof collidePosition !== 'undefined')
        {
          // we have a collision, move the Saucer out but don't change the rotation
          Physics.moveCircleOutOfStaticCircle(collidePosition, Obelisk.RADIUS, this.mesh.position, this.RADIUS);
          Sound.playerCollideObelisk();
        }
      }
    }
    else
    {
      this.setupWaiting();
    }
  },

  destroyed: function()
  {
    Indicators.setYellow(false);
  }

// end prototype
};
