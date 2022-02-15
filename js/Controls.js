import { log, error, panic } from '/js/UTIL.js';
import * as Keys from '/js/Keys.js'
import * as Player from '/js/Player.js'
import { TO_RADIANS } from '/js/UTIL.js'
import * as Encounter from '/js/Encounter.js'

export var current = null;
export var shootingAllowed = true;

export function init()
{
  useEncounterControls();
};

export function useFlyControls()
{
  shootingAllowed = true;
  current = new THREE.FirstPersonControls(Player);
  current.movementSpeed = 2.0;
  current.lookSpeed = 0.0001;
  current.constrainVertical = false; // default false
  current.verticalMin = 45 * TO_RADIANS;
  current.verticalMax = 135 * TO_RADIANS;
};

export function useEncounterControls()
{
  shootingAllowed = true;
  current = new SimpleControls(Player);
  current.movementSpeed = Encounter.MOVEMENT_SPEED;
  current.turnSpeed = Encounter.TURN_SPEED;
  current.accelerationFixed = false;
  Player.position.y = Encounter.CAMERA_HEIGHT;
  Player.rotation.x = 0;
  Player.rotation.z = 0;
};

export function useWarpControls()
{
  shootingAllowed = false;
  current = new SimpleControls(Player);
  current.movementSpeed = 0;
  current.turnSpeed = Encounter.TURN_SPEED;
  current.accelerationFixed = true;
};

export function interpretKeys(timeDeltaMillis)
{
  if (Keys.shooting && shootingAllowed)
  {
    Player.shoot();
  }
};
