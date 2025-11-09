/**
 * Missile.js - Homing missile enemy implementation
 * Tracks the player with side-to-side strafing motion
 * Used by Enemy.js for spawning missile threats
 */

import { TYPE_ENEMY } from './Radar.js';
import { MOVEMENT_SPEED as ENCOUNTER_MOVEMENT_SPEED, CAMERA_HEIGHT, ENEMY_SPAWN_DISTANCE_MAX, MISSILE_SPAWN_DISTANCE_MIN } from './Encounter.js';
import { cyan } from './C64.js';
import { randomLocationCloseToPlayer } from './Grid.js';
import { rotateObjectToLookAt, doCirclesCollide } from './MY3.js';
import { isCloseToAnObelisk, isCollidingWithObelisk, moveCircleOutOfStaticCircle } from './Physics.js';
import { RADIUS as OBELISK_RADIUS } from './Obelisk.js';
import { playerCollideObelisk } from './Sound.js';
import { setRed } from './Indicators.js';
import { log } from './UTIL.js';
import { Actor } from './Actors.js';
import { setupPlayerHitInCombat } from './State.js';
import { getPosition as Player_getPosition, RADIUS as Player_RADIUS, wasHit as Player_wasHit } from './Player.js';

// Constants
export const RADIUS = 50; // FIXME collides at this radius but doesn't appear it
export const GEOMETRY = new window.THREE.SphereGeometry(RADIUS, 4, 4);
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: cyan });
export const MESH_SCALE_X = 0.6; // TODO improve shape

export const radarType = TYPE_ENEMY;

// Player speed is Encounter.MOVEMENT_SPEED
export const MOVEMENT_SPEED = 1.8;

export const STRAFE_MAX_OFFSET = 50; // how far the missile will strafe away from a direct line to the player
export const STRAFE_TIME_MILLIS = 1100; // time to sweep from one side to the other

// Module state
let mesh = null;
let actor = null;
let strafeOffset = null; // current offset
let strafeTweenLoop = null; // keep a reference so we can start/stop on demand

/**
 * Initialize the missile system
 * Creates the mesh, sets up strafe tweens, and creates the actor
 */
export function init() {
  mesh = new window.THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.scale.x = MESH_SCALE_X;

  setupStrafeTweens();

  actor = new Actor(mesh, update, radarType);
}

/**
 * Spawn a missile near the player
 * @returns {Object} This module (for chaining)
 */
export function spawn() {
  setRed(true);

  const spawnPoint = randomLocationCloseToPlayer(ENEMY_SPAWN_DISTANCE_MAX, MISSILE_SPAWN_DISTANCE_MIN);
  spawnPoint.y = CAMERA_HEIGHT;
  log('spawning missile at ' + spawnPoint.x + ', ' + spawnPoint.y + ', ' + spawnPoint.z + ', distance ' + Math.floor(Player_getPosition().distanceTo(spawnPoint)));
  mesh.position.copy(spawnPoint);

  strafeOffset = -STRAFE_MAX_OFFSET; // start at one side for simplicity
  strafeTweenLoop.start();

  // Return the default export for chaining (mimics original behavior)
  return Missile;
}

/**
 * Set up an infinitely looping tween going back and forth between offsets
 */
function setupStrafeTweens() {
  // Create a proxy object that will be used by TWEEN
  const missileProxy = {
    get strafeOffset() { return strafeOffset; },
    set strafeOffset(value) { strafeOffset = value; }
  };

  const leftToRight = new window.TWEEN.Tween(missileProxy).to({ strafeOffset: STRAFE_MAX_OFFSET }, STRAFE_TIME_MILLIS);
  const rightToLeft = new window.TWEEN.Tween(missileProxy).to({ strafeOffset: -STRAFE_MAX_OFFSET }, STRAFE_TIME_MILLIS);

  leftToRight.chain(rightToLeft);
  rightToLeft.chain(leftToRight);

  strafeTweenLoop = leftToRight;
}

/**
 * Update the missile position and handle collisions
 * @param {number} timeDeltaMillis - Time elapsed since last update
 */
export function update(timeDeltaMillis) {
  window.TWEEN.update();

  mesh.translateX(strafeOffset);

  rotateObjectToLookAt(mesh, Player_getPosition());

  const actualMoveSpeed = timeDeltaMillis * MOVEMENT_SPEED;
  mesh.translateZ(-actualMoveSpeed);

  // if an obelisk is close (fast check), do a detailed collision check
  if (isCloseToAnObelisk(mesh.position, RADIUS)) {
    // check for precise collision
    const collidePosition = isCollidingWithObelisk(mesh.position, RADIUS);
    // if we get a return there is work to do
    if (collidePosition) {
      // we have a collision, move the Enemy out but don't change the rotation
      moveCircleOutOfStaticCircle(collidePosition, OBELISK_RADIUS, mesh.position, RADIUS);
      playerCollideObelisk();
    }
  }

  // offset to the side
  // collide and kill the player
  if (doCirclesCollide(mesh.position, RADIUS, Player_getPosition(), Player_RADIUS)) {
    Player_wasHit();
    setupPlayerHitInCombat();
  }
}

/**
 * Called when the missile is destroyed
 * Cleans up indicators and stops animations
 */
export function destroyed() {
  setRed(false);
  strafeTweenLoop.stop();
}

// Default export for backward compatibility
const Missile = {
  RADIUS,
  GEOMETRY,
  MATERIAL,
  MESH_SCALE_X,
  radarType,
  MOVEMENT_SPEED,
  STRAFE_MAX_OFFSET,
  STRAFE_TIME_MILLIS,
  get mesh() { return mesh; },
  set mesh(value) { mesh = value; },
  get actor() { return actor; },
  set actor(value) { actor = value; },
  get strafeOffset() { return strafeOffset; },
  set strafeOffset(value) { strafeOffset = value; },
  get strafeTweenLoop() { return strafeTweenLoop; },
  set strafeTweenLoop(value) { strafeTweenLoop = value; },
  init,
  spawn,
  update,
  destroyed
};

export default Missile;
