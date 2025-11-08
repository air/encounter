'use strict';

import { TO_RADIANS } from './UTIL.js';
import SimpleControls from './SimpleControls.js';
import Encounter from './Encounter.js';
import Keys from './Keys.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Player = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  shoot: () => console.log('Player.shoot called')
};

export let current = null;
export let shootingAllowed = true;

export function init() {
  useEncounterControls();
}

export function useFlyControls() {
  shootingAllowed = true;
  current = new window.THREE.FirstPersonControls(Player);
  current.movementSpeed = 2.0;
  current.lookSpeed = 0.0001;
  current.constrainVertical = false; // default false
  current.verticalMin = 45 * TO_RADIANS;
  current.verticalMax = 135 * TO_RADIANS;
}

export function useEncounterControls() {
  shootingAllowed = true;
  current = new SimpleControls(Player);
  current.movementSpeed = Encounter.MOVEMENT_SPEED;
  current.turnSpeed = Encounter.TURN_SPEED;
  current.accelerationFixed = false;
  Player.position.y = Encounter.CAMERA_HEIGHT;
  Player.rotation.x = 0;
  Player.rotation.z = 0;
}

export function useWarpControls() {
  shootingAllowed = false;
  current = new SimpleControls(Player);
  current.movementSpeed = 0;
  current.turnSpeed = Encounter.TURN_SPEED;
  current.accelerationFixed = true;
}

export function interpretKeys(timeDeltaMillis) {
  if (Keys.shooting && shootingAllowed) {
    Player.shoot();
  }
}

// Export default object for backward compatibility
export default {
  current,
  shootingAllowed,
  init,
  useFlyControls,
  useEncounterControls,
  useWarpControls,
  interpretKeys
};