/**
 * SaucerChaingun.js - Chaingun saucer enemy
 * Yellow/grey saucer firing 10 consecutive shots with no warning
 */

import Saucer, { FlickeringBasicMaterial } from './Saucer.js';
import { yellow, lightgrey } from './C64.js';
import { rotateObjectToLookAt } from './MY3.js';
import { newInstance as Shot_newInstance } from './Shot.js';
import { enemyShoot as Sound_enemyShoot } from './Sound.js';
import { log } from './UTIL.js';
import { getActors } from './State.js';

// CLAUDE-TODO: Replace with actual Player import when Player.js is converted to ES6 module
const Player = {
  position: { x: 0, y: 0, z: 0 }
};


// Type constants
export const FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames
export const MATERIAL = new FlickeringBasicMaterial([yellow, lightgrey], FLICKER_FRAMES);
export const SHOT_MATERIAL = new FlickeringBasicMaterial([yellow, lightgrey], FLICKER_FRAMES);

/**
 * SaucerChaingun constructor function
 * @param {THREE.Vector3} [location] - Optional spawn location
 * @returns {SaucerChaingun} SaucerChaingun instance
 */
export const SaucerChaingun = function(location) {
  Saucer.call(this, MATERIAL, location);

  // override defaults
  this.PERFORMS_SHOT_WINDUP = false;
  this.SHOTS_TO_FIRE = 10;
  this.SHOT_INTERVAL_MS = 300;

  log('new SaucerChaingun at ', this.mesh.position);
  this.setupMoving();
};

SaucerChaingun.prototype = Object.create(Saucer.prototype);

SaucerChaingun.prototype.shoot = function() {
  Sound_enemyShoot();
  rotateObjectToLookAt(this.mesh, Player.position);
  const shot = Shot_newInstance(this, this.mesh.position, this.mesh.rotation, SHOT_MATERIAL);
  getActors().add(shot.actor);
};

// Default export for backward compatibility
export default SaucerChaingun;
