/**
 * Missile.js - Homing missile enemy implementation
 * Tracks the player with side-to-side strafing motion
 * Used by Enemy.js for spawning missile threats
 */

import { TYPE_ENEMY } from './Radar.js';
import { MOVEMENT_SPEED, CAMERA_HEIGHT, ENEMY_SPAWN_DISTANCE_MAX, MISSILE_SPAWN_DISTANCE_MIN } from './Encounter.js';
import { cyan } from './C64.js';
import { randomLocationCloseToPlayer } from './Grid.js';
import { rotateObjectToLookAt, doCirclesCollide } from './MY3.js';
import { isCloseToAnObelisk, isCollidingWithObelisk, moveCircleOutOfStaticCircle } from './Physics.js';
import { RADIUS as OBELISK_RADIUS } from './Obelisk.js';
import { playerCollideObelisk } from './Sound.js';
import { setRed } from './Indicators.js';
import { log } from './UTIL.js';
import { Actor } from './Actors.js';

// CLAUDE-TODO: Replace with actual Player import when Player.js is converted to ES6 module
const Player = {
  position: { x: 0, y: 0, z: 0, distanceTo: () => 0 },
  RADIUS: 30,
  wasHit: () => {}
};

// CLAUDE-TODO: Replace with actual State import when State.js is converted to ES6 module
const State = {
  setupPlayerHitInCombat: () => {}
};

// Constants
export const RADIUS = 50; // FIXME collides at this radius but doesn't appear it
export const GEOMETRY = new window.THREE.SphereGeometry(RADIUS, 4, 4);
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: cyan });
export const MESH_SCALE_X = 0.6; // TODO improve shape

export const radarType = TYPE_ENEMY;

// Player speed is Encounter.MOVEMENT_SPEED
export const MISSILE_MOVEMENT_SPEED = 1.8;

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
  log('spawning missile at ' + spawnPoint.x + ', ' + spawnPoint.y + ', ' + spawnPoint.z + ', distance ' + Math.floor(Player.position.distanceTo(spawnPoint)));
  mesh.position.copy(spawnPoint);

  strafeOffset = -STRAFE_MAX_OFFSET; // start at one side for simplicity
  strafeTweenLoop.start();

  return { mesh, actor, update, destroyed, radarType };
}

/**
 * Set up an infinitely looping tween going back and forth between offsets
 */
function setupStrafeTweens() {
  const missileState = { strafeOffset: -STRAFE_MAX_OFFSET };

  const leftToRight = new window.TWEEN.Tween(missileState).to({ strafeOffset: STRAFE_MAX_OFFSET }, STRAFE_TIME_MILLIS);
  const rightToLeft = new window.TWEEN.Tween(missileState).to({ strafeOffset: -STRAFE_MAX_OFFSET }, STRAFE_TIME_MILLIS);

  leftToRight.chain(rightToLeft);
  rightToLeft.chain(leftToRight);

  // Update closure to keep strafeOffset in sync
  leftToRight.onUpdate(() => { strafeOffset = missileState.strafeOffset; });
  rightToLeft.onUpdate(() => { strafeOffset = missileState.strafeOffset; });

  strafeTweenLoop = leftToRight;
}

/**
 * Update the missile position and handle collisions
 * @param {number} timeDeltaMillis - Time elapsed since last update
 */
export function update(timeDeltaMillis) {
  window.TWEEN.update();

  mesh.translateX(strafeOffset);

  rotateObjectToLookAt(mesh, Player.position);

  const actualMoveSpeed = timeDeltaMillis * MISSILE_MOVEMENT_SPEED;
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
  if (doCirclesCollide(mesh.position, RADIUS, Player.position, Player.RADIUS)) {
    Player.wasHit();
    State.setupPlayerHitInCombat();
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

// Getters for module state
export function getMesh() { return mesh; }
export function getActor() { return actor; }
export function getStrafeOffset() { return strafeOffset; }

// Default export for backward compatibility
export default {
  RADIUS,
  GEOMETRY,
  MATERIAL,
  MESH_SCALE_X,
  radarType,
  MOVEMENT_SPEED: MISSILE_MOVEMENT_SPEED,
  STRAFE_MAX_OFFSET,
  STRAFE_TIME_MILLIS,
  get mesh() { return mesh; },
  get actor() { return actor; },
  get strafeOffset() { return strafeOffset; },
  init,
  spawn,
  update,
  destroyed,
  getMesh,
  getActor,
  getStrafeOffset
};
