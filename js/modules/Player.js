'use strict';

import { white as C64_white } from './C64.js';
import { TYPE_PLAYER as Radar_TYPE_PLAYER } from './Radar.js';
import { playerStartLocation as Grid_playerStartLocation, getIsActive as Grid_getIsActive } from './Grid.js';
import { PLAYER_INITIAL_ROTATION, PLAYER_LIVES, MAX_PLAYERS_SHOTS_ALLOWED, SHOT_INTERVAL_MS, PLAYER_MAX_SHIELDS } from './Encounter.js';
import { isCloseToAnObelisk, isCollidingWithObelisk, moveCircleOutOfStaticCircle } from './Physics.js';
import { RADIUS as Obelisk_RADIUS } from './Obelisk.js';
import { playerCollideObelisk as Sound_playerCollideObelisk, playerKilled as Sound_playerKilled, playerShoot as Sound_playerShoot } from './Sound.js';
import { newInstance as Shot_newInstance } from './Shot.js';
import { log } from './UTIL.js';
import MY3, { getClock } from './MY3.js';
import { getActors } from './State.js';

// Player constants
export const RADIUS = 40;
export const GEOMETRY = new window.THREE.SphereGeometry(RADIUS, 8, 4);
export const MATERIAL = MY3.MATS.wireframe.clone();
export const SHOT_MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64_white });

// Player instance - initially a default mesh, we'll define this in init()
export let player = new window.THREE.Mesh();

// Player state
// Note: radarType is initialized in init() to avoid circular dependency (State -> Player -> Radar -> State)
export let radarType = null;
export let lastTimeFired = null;
export let shotsInFlight = null;
export let shieldsLeft = null;
export let isAlive = false;
export let timeOfDeath = null;  // timestamp when we died, for a delay before going back into game

// Getters for player properties that need to be accessed from outside
export function getPosition() {
  return player.position;
}

export function getRotation() {
  return player.rotation;
}

export function getRadarType() {
  return radarType;
}

export function getIsAlive() {
  return isAlive;
}

export function getShieldsLeft() {
  return shieldsLeft;
}

export function getShotsInFlight() {
  return shotsInFlight;
}

export function getTimeOfDeath() {
  return timeOfDeath;
}

export function init() {
  // Initialize radarType here to avoid circular dependency at module load time
  radarType = Radar_TYPE_PLAYER;

  // actually set up this Mesh using our materials
  window.THREE.Mesh.call(player, GEOMETRY, MATERIAL);

  player.radarType = radarType;

  // FIXME for debug purposes player can move in pause mode - uncomment to fix this.
  //getActors().add(player);
}

export function resetPosition() {
  player.position.copy(Grid_playerStartLocation());

  player.rotation.x = 0;
  player.rotation.y = PLAYER_INITIAL_ROTATION;
  player.rotation.z = 0;

  log('reset player: position ' + player.position.x + ', ' + player.position.y + ', ' + player.position.z + ' and rotation.y ' + player.rotation.y);
}

export function resetShieldsLeft() {
  shieldsLeft = PLAYER_LIVES;
}

export function update() {
  // if an obelisk is close (fast check), do a detailed collision check
  if (Grid_getIsActive() && isCloseToAnObelisk(player.position, RADIUS)) {
    // check for precise collision
    var collidePosition = isCollidingWithObelisk(player.position, RADIUS);
    // if we get a return there is work to do
    if (collidePosition) {
      // we have a collision, move the player out but don't change the rotation
      moveCircleOutOfStaticCircle(collidePosition, Obelisk_RADIUS, player.position, RADIUS);
      Sound_playerCollideObelisk();
    }
  }
}

// player was hit either in Warp or in combat, amend local state.
export function wasHit() {
  Sound_playerKilled();
  isAlive = false;
  timeOfDeath = getClock().oldTime;

  shotsInFlight = 0;
  lastTimeFired = 0;
  log('reducing shields from ' + shieldsLeft + ' to ' + (shieldsLeft - 1));
  shieldsLeft -= 1;
}

export function shoot() {
  if (shotsInFlight < MAX_PLAYERS_SHOTS_ALLOWED) {
    // FIXME use the clock
    var now = new Date().getTime();
    var timeSinceLastShot = now - lastTimeFired;
    if (timeSinceLastShot > SHOT_INTERVAL_MS) {
      Sound_playerShoot();
      var shot = Shot_newInstance(player, player.position, player.rotation, SHOT_MATERIAL);
      shotsInFlight += 1;
      lastTimeFired = now;
      getActors().add(shot.actor);
    }
  }
}

export function awardBonusShield() {
  if (shieldsLeft < PLAYER_MAX_SHIELDS) {
    shieldsLeft += 1;
  }
}

// Setters for mutable state (needed by other modules)
export function setIsAlive(value) {
  isAlive = value;
}

export function setShotsInFlight(value) {
  shotsInFlight = value;
}

export function decrementShotsInFlight() {
  shotsInFlight -= 1;
}

// Export default object for backward compatibility
export default {
  RADIUS,
  GEOMETRY,
  MATERIAL,
  SHOT_MATERIAL,
  get player() { return player; },
  get position() { return player.position; },
  get rotation() { return player.rotation; },
  get radarType() { return radarType; },
  set radarType(value) { radarType = value; },
  get lastTimeFired() { return lastTimeFired; },
  set lastTimeFired(value) { lastTimeFired = value; },
  get shotsInFlight() { return shotsInFlight; },
  set shotsInFlight(value) { shotsInFlight = value; },
  get shieldsLeft() { return shieldsLeft; },
  set shieldsLeft(value) { shieldsLeft = value; },
  get isAlive() { return isAlive; },
  set isAlive(value) { isAlive = value; },
  get timeOfDeath() { return timeOfDeath; },
  set timeOfDeath(value) { timeOfDeath = value; },
  getPosition,
  getRotation,
  getRadarType,
  getIsAlive,
  getShieldsLeft,
  getShotsInFlight,
  getTimeOfDeath,
  init,
  resetPosition,
  resetShieldsLeft,
  update,
  wasHit,
  shoot,
  awardBonusShield,
  setIsAlive,
  setShotsInFlight,
  decrementShotsInFlight
};
