import { log, error, panic } from '/js/UTIL.js';
import { TO_RADIANS } from '/js/UTIL.js';
import * as MY3 from '/js/MY3.js'
import * as Grid from '/js/Grid.js'
import * as Player from '/js/Player.js'

// FIXME Camera and camera is confusing

// TODO TOP_DOWN is untested after we went to an infinite playfield, likely broken

export const MODE_FIRST_PERSON = 'first person';
export const MODE_CHASE = 'chase';
export const MODE_ORBIT = 'orbit';
export const MODE_TOP_DOWN = 'top down';
var mode = MODE_FIRST_PERSON;

export const CHASE_DISTANCE = 220;
export const CHASE_HEIGHT = 80;
export const CHASE_ANGLE_DOWN = 10 * -UTIL.TO_RADIANS;

export const ORBIT_DISTANCE = 600;
export const ORBIT_HEIGHT = 200;
export const ORBIT_SPEED = 0.0002;
var orbitCounter = 0;

var perspectiveCamera = null;
var orthoCamera = null;

export const TOPDOWN_HEIGHT_CUTOFF = 100;
// TODO adjust viewport shape to match screen shape
export const TOPDOWN_VIEWPORT_SIDE = 3000;

export function init()
{
  // store a ref to the normal camera
  perspectiveCamera = MY3.camera;
  orthoCamera = new THREE.OrthographicCamera(TOPDOWN_VIEWPORT_SIDE / -2, TOPDOWN_VIEWPORT_SIDE / 2, Camera.TOPDOWN_VIEWPORT_SIDE / 2, TOPDOWN_VIEWPORT_SIDE / -2, 1, 100);

  // removed since we want the camera to move in pause mode
  //State.actors.add(Camera);

  // put ortho camera in the centre
  orthoCamera.position.set(Grid.SIZE_SQUARE / 2, Camera.TOPDOWN_HEIGHT_CUTOFF, Grid.SIZE_SQUARE / 2);
  // look down
  orthoCamera.rotateOnAxis(MY3.X_AXIS, -90 * TO_RADIANS);
};

export function useOrbitMode()
{
  // external camera so let's render the player
  scene.add(Player);
  mode = MODE_ORBIT;
};

export function useFirstPersonMode()
{
  scene.remove(Player);
  mode = MODE_FIRST_PERSON;
};

export function update(timeDeltaMillis)
{
  if (mode === MODE_TOP_DOWN)
  {
    MY3.camera = orthoCamera;
    MY3.camera.position.x = Player.position.x;
    MY3.camera.position.z = Player.position.z;
  }
  else
  {
    MY3.camera = perspectiveCamera;
  }

  if (mode === MODE_FIRST_PERSON)
  {
    MY3.camera.position.copy(Player.position);
    MY3.camera.rotation.copy(Player.rotation);
  }
  else if (mode === MODE_CHASE)
  {
    MY3.camera.position.copy(Player.position);
    MY3.camera.rotation.copy(Player.rotation);

    MY3.camera.position.y += CHASE_HEIGHT;
    // could have used translateZ() instead here I think, after a pushMatrix() - see Shot constructor
    MY3.camera.position.z += CHASE_DISTANCE * Math.cos(Player.rotation.y);
    MY3.camera.position.x += CHASE_DISTANCE * Math.sin(Player.rotation.y);

    MY3.camera.rotateOnAxis(MY3.X_AXIS, CHASE_ANGLE_DOWN);
  }
  else if (mode === MODE_ORBIT)
  {
    MY3.camera.position.copy(Player.position);
    MY3.camera.rotation.copy(Player.rotation);
    MY3.camera.position.y += ORBIT_HEIGHT;
    MY3.camera.position.z += ORBIT_DISTANCE * Math.cos(orbitCounter);
    MY3.camera.position.x += ORBIT_DISTANCE * Math.sin(orbitCounter);
    MY3.camera.lookAt(Player.position);
    orbitCounter += (ORBIT_SPEED * timeDeltaMillis);
  }
};
