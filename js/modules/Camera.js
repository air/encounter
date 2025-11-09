'use strict';

import { TO_RADIANS } from './UTIL.js';
import { X_AXIS, getCamera, setCamera, getScene } from './MY3.js';
import { getSizeSquare } from './Grid.js';
import { getPosition as Player_getPosition, getRotation as Player_getRotation } from './Player.js';

// FIXME Camera and camera is confusing

// TODO TOP_DOWN is untested after we went to an infinite playfield, likely broken

export const MODE_FIRST_PERSON = 'first person';
export const MODE_CHASE = 'chase';
export const MODE_ORBIT = 'orbit';
export const MODE_TOP_DOWN = 'top down';
export let mode = MODE_FIRST_PERSON;

export const CHASE_DISTANCE = 220;
export const CHASE_HEIGHT = 80;
export const CHASE_ANGLE_DOWN = 10 * -TO_RADIANS;

export const ORBIT_DISTANCE = 600;
export const ORBIT_HEIGHT = 200;
export const ORBIT_SPEED = 0.0002;
export let orbitCounter = 0;

let perspectiveCamera = null;
let orthoCamera = null;

export const TOPDOWN_HEIGHT_CUTOFF = 100;
// TODO adjust viewport shape to match screen shape
export const TOPDOWN_VIEWPORT_SIDE = 3000;

export function init() {
  // store a ref to the normal camera
  perspectiveCamera = getCamera();
  orthoCamera = new window.THREE.OrthographicCamera(TOPDOWN_VIEWPORT_SIDE / -2, TOPDOWN_VIEWPORT_SIDE / 2, TOPDOWN_VIEWPORT_SIDE / 2, TOPDOWN_VIEWPORT_SIDE / -2, 1, 100);

  // removed since we want the camera to move in pause mode
  //State.actors.add(Camera);

  // put ortho camera in the centre
  orthoCamera.position.set(getSizeSquare() / 2, TOPDOWN_HEIGHT_CUTOFF, getSizeSquare() / 2);
  // look down
  orthoCamera.rotateOnAxis(X_AXIS, -90 * TO_RADIANS);
}

export function useOrbitMode() {
  // external camera so let's render the player
  getScene().add(Player);
  mode = MODE_ORBIT;
}

export function useFirstPersonMode() {
  getScene().remove(Player);
  mode = MODE_FIRST_PERSON;
}

export function update(timeDeltaMillis) {
  let camera;
  if (mode === MODE_TOP_DOWN)
  {
    camera = orthoCamera;
    camera.position.x = Player_getPosition().x;
    camera.position.z = Player_getPosition().z;
  }
  else
  {
    camera = perspectiveCamera;
  }

  setCamera(camera);

  if (mode === MODE_FIRST_PERSON)
  {
    camera.position.copy(Player_getPosition());
    camera.rotation.copy(Player_getRotation());
  }
  else if (mode === MODE_CHASE)
  {
    camera.position.copy(Player_getPosition());
    camera.rotation.copy(Player_getRotation());

    camera.position.y += CHASE_HEIGHT;
    // could have used translateZ() instead here I think, after a pushMatrix() - see Shot constructor
    camera.position.z += CHASE_DISTANCE * Math.cos(Player_getRotation().y);
    camera.position.x += CHASE_DISTANCE * Math.sin(Player_getRotation().y);

    camera.rotateOnAxis(X_AXIS, CHASE_ANGLE_DOWN);
  }
  else if (mode === MODE_ORBIT)
  {
    camera.position.copy(Player_getPosition());
    camera.rotation.copy(Player_getRotation());
    camera.position.y += ORBIT_HEIGHT;
    camera.position.z += ORBIT_DISTANCE * Math.cos(orbitCounter);
    camera.position.x += ORBIT_DISTANCE * Math.sin(orbitCounter);
    camera.lookAt(Player_getPosition());
    orbitCounter += (ORBIT_SPEED * timeDeltaMillis);
  }
}

// Export default object for backward compatibility
export default {
  MODE_FIRST_PERSON,
  MODE_CHASE,
  MODE_ORBIT,
  MODE_TOP_DOWN,
  mode,
  CHASE_DISTANCE,
  CHASE_HEIGHT,
  CHASE_ANGLE_DOWN,
  ORBIT_DISTANCE,
  ORBIT_HEIGHT,
  ORBIT_SPEED,
  orbitCounter,
  perspectiveCamera,
  orthoCamera,
  TOPDOWN_HEIGHT_CUTOFF,
  TOPDOWN_VIEWPORT_SIDE,
  init,
  useOrbitMode,
  useFirstPersonMode,
  update
};