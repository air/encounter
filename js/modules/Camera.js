'use strict';

import * as UTIL from './UTIL.js';
import * as MY3 from './MY3.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Grid = {
  SIZE_SQUARE: 10000  // placeholder value
};

const Player = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 }
};

// Mock scene and camera globals until proper initialization
const scene = {
  add: (object) => console.log('Scene.add called with:', object.constructor?.name || 'object'),
  remove: (object) => console.log('Scene.remove called with:', object.constructor?.name || 'object')
};

let camera = null; // Will be set to perspectiveCamera or orthoCamera

// FIXME Camera and camera is confusing

// TODO TOP_DOWN is untested after we went to an infinite playfield, likely broken

export const MODE_FIRST_PERSON = 'first person';
export const MODE_CHASE = 'chase';
export const MODE_ORBIT = 'orbit';
export const MODE_TOP_DOWN = 'top down';

let mode = MODE_FIRST_PERSON;

export const CHASE_DISTANCE = 220;
export const CHASE_HEIGHT = 80;
export const CHASE_ANGLE_DOWN = 10 * -UTIL.TO_RADIANS;

export const ORBIT_DISTANCE = 600;
export const ORBIT_HEIGHT = 200;
export const ORBIT_SPEED = 0.0002;
let orbitCounter = 0;

let perspectiveCamera = null;
let orthoCamera = null;

export const TOPDOWN_HEIGHT_CUTOFF = 100;
// TODO adjust viewport shape to match screen shape
export const TOPDOWN_VIEWPORT_SIDE = 3000;

export function init() {
  // CLAUDE-TODO: store a ref to the normal camera when global camera is available
  // perspectiveCamera = camera;
  console.log('Camera.init called - perspective camera will be assigned when available');
  
  orthoCamera = new window.THREE.OrthographicCamera(
    TOPDOWN_VIEWPORT_SIDE / -2, 
    TOPDOWN_VIEWPORT_SIDE / 2, 
    TOPDOWN_VIEWPORT_SIDE / 2, 
    TOPDOWN_VIEWPORT_SIDE / -2, 
    1, 
    100
  );

  // removed since we want the camera to move in pause mode
  //State.actors.add(Camera);

  // put ortho camera in the centre
  orthoCamera.position.set(Grid.SIZE_SQUARE / 2, TOPDOWN_HEIGHT_CUTOFF, Grid.SIZE_SQUARE / 2);
  // look down
  orthoCamera.rotateOnAxis(MY3.X_AXIS, -90 * UTIL.TO_RADIANS);
}

export function useOrbitMode() {
  // external camera so let's render the player
  scene.add(Player);
  mode = MODE_ORBIT;
}

export function useFirstPersonMode() {
  scene.remove(Player);
  mode = MODE_FIRST_PERSON;
}

export function update(timeDeltaMillis) {
  if (mode === MODE_TOP_DOWN) {
    camera = orthoCamera;
    if (camera) {
      camera.position.x = Player.position.x;
      camera.position.z = Player.position.z;
    }
  } else {
    camera = perspectiveCamera;
  }

  if (!camera) {
    console.log('Camera.update: camera not yet initialized');
    return;
  }

  if (mode === MODE_FIRST_PERSON) {
    camera.position.copy(Player.position);
    camera.rotation.copy(Player.rotation);
  } else if (mode === MODE_CHASE) {
    camera.position.copy(Player.position);
    camera.rotation.copy(Player.rotation);

    camera.position.y += CHASE_HEIGHT;
    // could have used translateZ() instead here I think, after a pushMatrix() - see Shot constructor
    camera.position.z += CHASE_DISTANCE * Math.cos(Player.rotation.y);
    camera.position.x += CHASE_DISTANCE * Math.sin(Player.rotation.y);

    camera.rotateOnAxis(MY3.X_AXIS, CHASE_ANGLE_DOWN);
  } else if (mode === MODE_ORBIT) {
    camera.position.copy(Player.position);
    camera.rotation.copy(Player.rotation);
    camera.position.y += ORBIT_HEIGHT;
    camera.position.z += ORBIT_DISTANCE * Math.cos(orbitCounter);
    camera.position.x += ORBIT_DISTANCE * Math.sin(orbitCounter);
    camera.lookAt(Player.position);
    orbitCounter += (ORBIT_SPEED * timeDeltaMillis);
  }
}

// Getters for module state
export function getMode() { return mode; }
export function setMode(newMode) { mode = newMode; }
export function getPerspectiveCamera() { return perspectiveCamera; }
export function setPerspectiveCamera(cam) { perspectiveCamera = cam; }
export function getOrthoCamera() { return orthoCamera; }
export function getOrbitCounter() { return orbitCounter; }
export function setOrbitCounter(counter) { orbitCounter = counter; }

// Export default object for backward compatibility
export default {
  MODE_FIRST_PERSON,
  MODE_CHASE,
  MODE_ORBIT,
  MODE_TOP_DOWN,
  CHASE_DISTANCE,
  CHASE_HEIGHT,
  CHASE_ANGLE_DOWN,
  ORBIT_DISTANCE,
  ORBIT_HEIGHT,
  ORBIT_SPEED,
  TOPDOWN_HEIGHT_CUTOFF,
  TOPDOWN_VIEWPORT_SIDE,
  init,
  useOrbitMode,
  useFirstPersonMode,
  update,
  getMode,
  setMode,
  getPerspectiveCamera,
  setPerspectiveCamera,
  getOrthoCamera,
  getOrbitCounter,
  setOrbitCounter
};