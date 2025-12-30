/**
 * SaucerAutoShotgun.js - Auto-shotgun saucer enemy
 * Lightgrey saucer firing 3 consecutive shotgun blasts with no warning
 */

import { Saucer } from './Saucer.js';
import { lightgrey } from './C64.js';
import { rotateObjectToLookAt } from './MY3.js';
import { newInstance as Shot_newInstance } from './Shot.js';
import { enemyShoot as Sound_enemyShoot } from './Sound.js';
import { log } from './UTIL.js';
import { getActors } from './State.js';
import { getPosition as Player_getPosition } from './Player.js';



// Type constants
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: lightgrey });
export const SHOT_MATERIAL = MATERIAL;
export const SHOT_SPREAD = 0.05;

/**
 * SaucerAutoShotgun ES6 class
 * Extends Saucer with auto-shotgun behavior (3 consecutive shotgun blasts)
 */
export class SaucerAutoShotgun extends Saucer {
  constructor(location) {
    super(MATERIAL, location);

    // override defaults
    this.PERFORMS_SHOT_WINDUP = false;
    this.SHOTS_TO_FIRE = 3;
    this.SHOT_INTERVAL_MS = 500;

    log('new SaucerAutoShotgun at ', this.mesh.position);
    this.setupMoving();
  }

  shoot() {
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
  }
}

// Default export for backward compatibility
export default SaucerAutoShotgun;

