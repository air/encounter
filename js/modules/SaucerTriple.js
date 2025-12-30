/**
 * SaucerTriple.js - Triple-shot saucer enemy
 * Cyan/grey saucer firing three successive shots with windup sound
 */

import { Saucer, FlickeringBasicMaterial } from './Saucer.js';
import { cyan, lightgrey } from './C64.js';
import { rotateObjectToLookAt } from './MY3.js';
import { newInstance as Shot_newInstance } from './Shot.js';
import { enemyShoot as Sound_enemyShoot } from './Sound.js';
import { log } from './UTIL.js';
import { getActors } from './State.js';
import { getPosition as Player_getPosition } from './Player.js';


// Type constants
export const FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames
export const MATERIAL = new FlickeringBasicMaterial([cyan, lightgrey], FLICKER_FRAMES);
export const SHOT_MATERIAL = new FlickeringBasicMaterial([cyan, lightgrey], FLICKER_FRAMES);

/**
 * SaucerTriple ES6 class
 * Extends Saucer with triple-shot behavior
 */
export class SaucerTriple extends Saucer {
  constructor(location) {
    super(MATERIAL, location);

    // override defaults
    this.SHOTS_TO_FIRE = 3;

    log('new SaucerTriple at ', this.mesh.position);
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
export default SaucerTriple;

