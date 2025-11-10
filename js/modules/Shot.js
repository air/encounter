/**
 * Shot.js - Projectile system for both player and enemy shots
 * Handles shot creation, movement, collision detection, and cleanup
 */

import { FlickeringBasicMaterial, doCirclesCollide } from './MY3.js';
import { isCloseToAnObelisk, isCollidingWithObelisk, bounceObjectOutOfIntersectingCircle } from './Physics.js';
import { RADIUS as OBELISK_RADIUS } from './Obelisk.js';
import { shotBounce as Sound_shotBounce } from './Sound.js';
import { SHOT_SPEED } from './Encounter.js';
import { TYPE_SHOT as RADAR_TYPE_SHOT } from './Radar.js';
import { Actor } from './Actors.js';
import { setBlue as Indicators_setBlue } from './Indicators.js';
import { getIsAlive as Enemy_getIsAlive, getCurrent as Enemy_getCurrent, destroyed as Enemy_destroyed } from './Enemy.js';
import { getActors, setupPlayerHitInCombat } from './State.js';
import { getPosition as Player_getPosition, RADIUS as Player_RADIUS, wasHit as Player_wasHit, decrementShotsInFlight as Player_decrementShotsInFlight, player as Player } from './Player.js';

// Constants
export const RADIUS = 40;
export const OFFSET_FROM_SHOOTER = 120; // created this far in front of you
export const CAN_TRAVEL = 16000; // TODO confirm
export const GEOMETRY = new window.THREE.SphereGeometry(RADIUS, 16, 16);

export const TYPE_PLAYER = 'playerShot';
export const TYPE_ENEMY = 'enemyShot';

/**
 * Create a new shot fired by the shooterObject
 * @param {Object} shooterObject - The object firing the shot (Player or Enemy)
 * @param {THREE.Vector3} shooterPosition - Position to spawn shot from
 * @param {THREE.Euler} shooterRotation - Rotation of the shooter
 * @param {THREE.Material} material - Material for the shot mesh
 * @returns {THREE.Mesh} The shot mesh with actor attached
 */
export function newInstance(shooterObject, shooterPosition, shooterRotation, material) {
  const newShot = new window.THREE.Mesh(GEOMETRY, material);

  newShot.shotType = (shooterObject === Player ? TYPE_PLAYER : TYPE_ENEMY);

  newShot.radarType = RADAR_TYPE_SHOT;

  newShot.position.copy(shooterPosition);
  newShot.rotation.copy(shooterRotation);
  newShot.translateZ(-OFFSET_FROM_SHOOTER);

  newShot.hasTravelled = 0;

  // update is a closure passed over to Actor and invoked there, so we need 'self' to track the owning object
  const self = newShot;
  const update = function(timeDeltaMillis) {
    if (self.material instanceof FlickeringBasicMaterial) {
      self.material.tick();
    }

    // move the shot
    const actualMoveSpeed = timeDeltaMillis * SHOT_SPEED;
    self.translateZ(-actualMoveSpeed);
    self.hasTravelled += actualMoveSpeed;

    // expire an aging shot based on distance travelled
    if (self.hasTravelled > CAN_TRAVEL) {
      cleanUpDeadShot(self);
    }
    else {
      collideWithObelisks(self);
      collideWithShips(self);
    }
  };

  newShot.actor = new Actor(newShot, update, newShot.radarType);

  return newShot;
}

/**
 * Check and handle collision with obelisks
 * @param {THREE.Mesh} shot - The shot object to check
 */
function collideWithObelisks(shot) {
  // if an obelisk is close (fast check), do a detailed collision check
  if (isCloseToAnObelisk(shot.position, RADIUS)) {
    // check for precise collision
    const collidePosition = isCollidingWithObelisk(shot.position, RADIUS);
    // if we get a return value we have work to do
    if (collidePosition) {
      // we have a collision, bounce
      bounceObjectOutOfIntersectingCircle(collidePosition, OBELISK_RADIUS, shot, RADIUS);
      Sound_shotBounce();
    }
  }
}

/**
 * Check and handle collision with ships (player or enemy)
 * @param {THREE.Mesh} shot - The shot object to check
 */
function collideWithShips(shot) {
  // kill the player
  if (shot.shotType === TYPE_ENEMY && doCirclesCollide(shot.position, RADIUS, Player_getPosition(), Player_RADIUS)) {
    Player_wasHit();
    setupPlayerHitInCombat();
  }
  // kill the enemy
  if (shot.shotType === TYPE_PLAYER && Enemy_getIsAlive() && doCirclesCollide(shot.position, RADIUS, Enemy_getCurrent().mesh.position, Enemy_getCurrent().RADIUS)) {
    Enemy_destroyed();
    // remove the shot
    cleanUpDeadShot(shot);
  }
}

/**
 * For use with Array.every() where the Array contains Actor objects
 * FIXME use instanceof Shot here for sanity
 * @param {Actor} element - Actor element to check
 * @param {number} index - Array index
 * @param {Array} array - The array
 * @returns {boolean} True if not an enemy shot
 */
export function isNotEnemyShot(element, index, array) {
  if (element.getObject3D().shotType === TYPE_ENEMY) {
    return false;
  }
  else { // it's a Player shot or shotType is undefined
    return true;
  }
}

/**
 * Clean up a dead shot
 * @param {THREE.Mesh} shot - The shot to clean up
 */
function cleanUpDeadShot(shot) {
  getActors().remove(shot.actor);

  if (shot.shotType === TYPE_PLAYER) {
    Player_decrementShotsInFlight();
  }
  else { // if this was the last enemy shot cleaned up, no enemy shots remain so kill the blue light
    if (getActors().list.every(isNotEnemyShot)) {
      Indicators_setBlue(false);
    }
  }
}

// Export default object for backward compatibility
export default {
  RADIUS,
  OFFSET_FROM_SHOOTER,
  CAN_TRAVEL,
  GEOMETRY,
  TYPE_PLAYER,
  TYPE_ENEMY,
  newInstance,
  isNotEnemyShot
};
