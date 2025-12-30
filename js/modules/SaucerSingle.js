/**
 * SaucerSingle.js - Single-shot saucer enemy
 * The first enemy type: a yellow saucer firing one shot with windup sound
 */

import { Saucer } from './Saucer.js';
import { yellow } from './C64.js';
import { rotateObjectToLookAt } from './MY3.js';
import { newInstance as Shot_newInstance } from './Shot.js';
import { enemyShoot as Sound_enemyShoot } from './Sound.js';
import { log } from './UTIL.js';
import { getActors } from './State.js';
import { getPosition as Player_getPosition } from './Player.js';

// Type constants
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: yellow });
export const SHOT_MATERIAL = MATERIAL;

/**
 * SaucerSingle ES6 class
 * Extends Saucer with single-shot behavior
 */
export class SaucerSingle extends Saucer {
  constructor(location) {
    super(MATERIAL, location);
    log('new SaucerSingle at ', this.mesh.position);
    this.setupMoving();
  }

  shoot() {
    rotateObjectToLookAt(this.mesh, Player_getPosition());
    Sound_enemyShoot();
    const shot = Shot_newInstance(this, this.mesh.position, this.mesh.rotation, SHOT_MATERIAL);
    getActors().add(shot.actor);
  }
}

// Default export for backward compatibility
export default SaucerSingle;

