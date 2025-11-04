/**
 * Saucer.js - Base saucer enemy type
 * Abstract base class for flying saucer enemies with movement patterns
 * Derived objects must implement: shoot()
 */

import { random } from './UTIL.js';
import { log, panic } from './UTIL.js';
import { FlickeringBasicMaterial, randomDirection, rotateObjectToLookAt } from './MY3.js';
import { isCloseToAnObelisk, isCollidingWithObelisk, moveCircleOutOfStaticCircle } from './Physics.js';
import { RADIUS as OBELISK_RADIUS } from './Obelisk.js';
import { saucerWait, saucerMove, shotWindup, playerCollideObelisk } from './Sound.js';
import { setYellow as Indicators_setYellow, setBlue as Indicators_setBlue } from './Indicators.js';
import { TYPE_ENEMY } from './Radar.js';
import { Actor } from './Actors.js';

// Export FlickeringBasicMaterial for use by subclasses
export { FlickeringBasicMaterial };

// Constants
export const RADIUS = 70;
export const GEOMETRY = new window.THREE.SphereGeometry(RADIUS, 8, 2);
export const MESH_SCALE_Y = 0.6;
export const MOVEMENT_SPEED = 1.0;  // Player speed is Encounter.MOVEMENT_SPEED
export const STATE_MOVING = 'moving';
export const STATE_WAITING = 'waiting';
export const STATE_SHOT_WINDUP = 'shotWindup';
export const STATE_SHOOTING = 'shooting';
export const MOVE_TIME_MAX_MS = 5000;
export const MOVE_TIME_MIN_MS = 1000;
export const WAIT_TIME_MAX_MS = 2000;
export const WAIT_TIME_MIN_MS = 1000;

/**
 * Saucer constructor function
 * @param {THREE.Material} material - Material for the saucer mesh
 * @param {THREE.Vector3} [location] - Optional spawn location
 * @returns {Object} Saucer instance
 */
export const Saucer = function(material, location) {
  if (material === undefined) {
    panic('Saucer must be provided a material');
  }

  this.mesh = new window.THREE.Mesh(GEOMETRY, material);
  this.mesh.scale.y = MESH_SCALE_Y;

  if (location) {
    this.mesh.position.copy(location);
  }

  // update is a closure passed over to Actor and invoked there, so we need 'self' to track the owning Saucer instance
  const self = this;
  const update = function(timeDeltaMillis) {
    if (self === undefined) {
      panic('Saucer: self is undefined, wtf', this);
    }

    if (self.state === undefined) {
      panic('Saucer: self.state is undefined, wtf', self);
    }

    // things we do regardless of state
    if (self.mesh.material instanceof FlickeringBasicMaterial) {
      self.mesh.material.tick();
    }

    switch(self.state) {
      case STATE_WAITING:
        self.updateWaiting(timeDeltaMillis);
        break;
      case STATE_MOVING:
        self.updateMoving(timeDeltaMillis);
        break;
      case STATE_SHOT_WINDUP:
        self.updateShotWindup(timeDeltaMillis);
        break;
      case STATE_SHOOTING:
        self.updateShooting(timeDeltaMillis);
        break;
      default:
        panic('unknown Saucer state: ' + self.state);
    }
  };

  this.actor = new Actor(this.mesh, update, TYPE_ENEMY);
  return this;
};

Saucer.prototype = {
  // config defaults. TODO configure at create time
  RADIUS: RADIUS,
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

  setupWaiting: function() {
    this.waitingCountdown = random(WAIT_TIME_MIN_MS, WAIT_TIME_MAX_MS);
    log('enemy waiting for ' + this.waitingCountdown + 'ms');
    saucerWait(this.waitingCountdown);
    this.state = STATE_WAITING;
  },

  updateWaiting: function(timeDeltaMillis) {
    this.waitingCountdown -= timeDeltaMillis;
    if (this.waitingCountdown <= 0) {
      this.setupMoving();
    }
    else {
      // FIXME delegate AI to subclass
      if (random(50) === 42) {
        if (this.PERFORMS_SHOT_WINDUP) {
          this.setupShotWindup();
        }
        else {
          this.setupShooting();
        }
      }
    }
  },

  setupShotWindup: function() {
    this.shotWindupCountdown = this.SHOT_WINDUP_TIME_MS;
    shotWindup();
    log('enemy winding up shot for ' + this.SHOT_WINDUP_TIME_MS + 'ms');
    this.state = STATE_SHOT_WINDUP;
  },

  shoot: function() {
    panic('Saucer.shoot must be overridden');
  },

  setupShooting: function() {
    log('enemy shooting');
    // we will always shoot immediately after the windup, so might as well do it here
    this.shoot();
    Indicators_setBlue(true);

    if (this.SHOTS_TO_FIRE > 1) {
      this.shotsLeftToFire = this.SHOTS_TO_FIRE - 1;
      this.shotIntervalCountdown = this.SHOT_INTERVAL_MS;
      this.state = STATE_SHOOTING;
    }
    else {
      this.setupMoving();
    }
  },

  setupMoving: function() {
    this.movingCountdown = random(MOVE_TIME_MIN_MS, MOVE_TIME_MAX_MS);
    this.mesh.rotation.y = randomDirection();
    log('enemy moving for ' + this.movingCountdown + 'ms in direction ' + this.mesh.rotation.y);
    saucerMove(this.movingCountdown);
    this.state = STATE_MOVING;
  },

  updateShotWindup: function(timeDeltaMillis) {
    this.shotWindupCountdown -= timeDeltaMillis;
    if (this.shotWindupCountdown <= 0) {
      this.setupShooting();
    }
  },

  updateShooting: function(timeDeltaMillis) {
    this.shotIntervalCountdown -= timeDeltaMillis;

    if (this.shotIntervalCountdown <= 0) {
      this.shoot();
      this.shotsLeftToFire -= 1;
      this.shotIntervalCountdown = this.SHOT_INTERVAL_MS;
    }

    if (this.shotsLeftToFire <= 0) {
      this.setupMoving();
    }
  },

  updateMoving: function(timeDeltaMillis) {
    this.movingCountdown -= timeDeltaMillis;
    if (this.movingCountdown > 0) {
      const actualMoveSpeed = timeDeltaMillis * MOVEMENT_SPEED;
      this.mesh.translateZ(-actualMoveSpeed);

      // if an obelisk is close (fast check), do a detailed collision check
      if (isCloseToAnObelisk(this.mesh.position, this.RADIUS)) {
        // check for precise collision
        const collidePosition = isCollidingWithObelisk(this.mesh.position, this.RADIUS);
        // if we get a return there is work to do
        if (collidePosition) {
          // we have a collision, move the Saucer out but don't change the rotation
          moveCircleOutOfStaticCircle(collidePosition, OBELISK_RADIUS, this.mesh.position, this.RADIUS);
          playerCollideObelisk();
        }
      }
    }
    else {
      this.setupWaiting();
    }
  },

  destroyed: function() {
    Indicators_setYellow(false);
  }

// end prototype
};

// Default export for backward compatibility
export default Saucer;
