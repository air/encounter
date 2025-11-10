/**
 * SaucerShotgun.js - Shotgun saucer enemy
 * Lightgreen saucer that fires a shotgun blast of 3 shots with no warning
 */

import Saucer from './Saucer.js';
import { lightgreen } from './C64.js';
import { rotateObjectToLookAt } from './MY3.js';
import { newInstance as Shot_newInstance } from './Shot.js';
import { enemyShoot as Sound_enemyShoot } from './Sound.js';
import { log } from './UTIL.js';
import { getActors } from './State.js';
import { getPosition as Player_getPosition } from './Player.js';



// Type constants
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: lightgreen });
export const SHOT_MATERIAL = MATERIAL;
export const SHOT_SPREAD = 0.05;

/**
 * SaucerShotgun constructor function
 * @param {THREE.Vector3} [location] - Optional spawn location
 * @returns {SaucerShotgun} SaucerShotgun instance
 */
export const SaucerShotgun = function(location) {
  Saucer.call(this, MATERIAL, location);

  // override defaults
  this.PERFORMS_SHOT_WINDUP = false;

  log('new SaucerShotgun at ', this.mesh.position);
  this.setupMoving();
};

SaucerShotgun.prototype = Object.create(Saucer.prototype);

SaucerShotgun.prototype.shoot = function() {
  Sound_enemyShoot();

  // shot 1 directly at player
  rotateObjectToLookAt(this.mesh, Player_getPosition());
  const shotMiddle = Shot_newInstance(this, this.mesh.position, this.mesh.rotation, SHOT_MATERIAL);
  // shot 2 to the right of target
  this.mesh.rotation.y -= SHOT_SPREAD;
  const shotRight = Shot_newInstance(this, this.mesh.position, this.mesh.rotation, SHOT_MATERIAL);
  // shot 3 to the left
  this.mesh.rotation.y += (SHOT_SPREAD * 2);
  const shotLeft = Shot_newInstance(this, this.mesh.position, this.mesh.rotation, SHOT_MATERIAL);

  getActors().add(shotMiddle.actor);
  getActors().add(shotRight.actor);
  getActors().add(shotLeft.actor);
};

// Default export for backward compatibility
export default SaucerShotgun;
