/**
 * SaucerTriple.js - Triple-shot saucer enemy
 * Cyan/grey saucer firing three successive shots with windup sound
 */

import Saucer, { FlickeringBasicMaterial } from './Saucer.js';
import { cyan, lightgrey } from './C64.js';
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
export const FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames
export const MATERIAL = new FlickeringBasicMaterial([cyan, lightgrey], FLICKER_FRAMES);
export const SHOT_MATERIAL = new FlickeringBasicMaterial([cyan, lightgrey], FLICKER_FRAMES);

/**
 * SaucerTriple constructor function
 * @param {THREE.Vector3} [location] - Optional spawn location
 * @returns {SaucerTriple} SaucerTriple instance
 */
export const SaucerTriple = function(location) {
  Saucer.call(this, MATERIAL, location);

  // override defaults
  this.SHOTS_TO_FIRE = 3;

  log('new SaucerTriple at ', this.mesh.position);
  this.setupMoving();
};

SaucerTriple.prototype = Object.create(Saucer.prototype);

SaucerTriple.prototype.shoot = function() {
  rotateObjectToLookAt(this.mesh, Player.position);
  Sound_enemyShoot();
  const shot = Shot_newInstance(this, this.mesh.position, this.mesh.rotation, SHOT_MATERIAL);
  State.actors.add(shot.actor);
};

// Default export for backward compatibility
export default SaucerTriple;
