/**
 * SaucerSingle.js - Single-shot saucer enemy
 * The first enemy type: a yellow saucer firing one shot with windup sound
 */

import Saucer from './Saucer.js';
import { yellow } from './C64.js';
import { rotateObjectToLookAt } from './MY3.js';
import { newInstance as Shot_newInstance } from './Shot.js';
import { enemyShoot as Sound_enemyShoot } from './Sound.js';
import { log } from './UTIL.js';

// CLAUDE-TODO: Replace with actual Player import when Player.js is converted to ES6 module
const Player = {
  position: { x: 0, y: 0, z: 0 }
};

// CLAUDE-TODO: Replace with actual State import when State.js is converted to ES6 module
const State = {
  actors: { add: () => {} }
};

// Type constants
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: yellow });
export const SHOT_MATERIAL = MATERIAL;

/**
 * SaucerSingle constructor function
 * @param {THREE.Vector3} [location] - Optional spawn location
 * @returns {SaucerSingle} SaucerSingle instance
 */
export const SaucerSingle = function(location) {
  Saucer.call(this, MATERIAL, location);

  log('new SaucerSingle at ', this.mesh.position);
  this.setupMoving();
};

SaucerSingle.prototype = Object.create(Saucer.prototype);

SaucerSingle.prototype.shoot = function() {
  rotateObjectToLookAt(this.mesh, Player.position);
  Sound_enemyShoot();
  const shot = Shot_newInstance(this, this.mesh.position, this.mesh.rotation, SHOT_MATERIAL);
  State.actors.add(shot.actor);
};

// Default export for backward compatibility
export default SaucerSingle;
