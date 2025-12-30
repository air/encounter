/**
 * SaucerChaingun.js - Chaingun saucer enemy
 * Yellow/grey saucer firing 10 consecutive shots with no warning
 */

import { Saucer, FlickeringBasicMaterial } from './Saucer.js';
import { yellow, lightgrey } from './C64.js';
import { rotateObjectToLookAt } from './MY3.js';
import { newInstance as Shot_newInstance } from './Shot.js';
import { enemyShoot as Sound_enemyShoot } from './Sound.js';
import { log } from './UTIL.js';
import { getActors } from './State.js';
import { getPosition as Player_getPosition } from './Player.js';



// Type constants
export const FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames
export const MATERIAL = new FlickeringBasicMaterial([yellow, lightgrey], FLICKER_FRAMES);
export const SHOT_MATERIAL = new FlickeringBasicMaterial([yellow, lightgrey], FLICKER_FRAMES);

/**
 * SaucerChaingun ES6 class
 * Extends Saucer with chaingun behavior (10 shots, no windup)
 */
export class SaucerChaingun extends Saucer {
  constructor(location) {
    super(MATERIAL, location);

    // override defaults
    this.PERFORMS_SHOT_WINDUP = false;
    this.SHOTS_TO_FIRE = 10;
    this.SHOT_INTERVAL_MS = 300;

    log('new SaucerChaingun at ', this.mesh.position);
    this.setupMoving();
  }

  shoot() {
    Sound_enemyShoot();
    rotateObjectToLookAt(this.mesh, Player_getPosition());
    const shot = Shot_newInstance(this, this.mesh.position, this.mesh.rotation, SHOT_MATERIAL);
    getActors().add(shot.actor);
  }
}

// Default export for backward compatibility
export default SaucerChaingun;

