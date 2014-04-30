"use strict";

// FIXME Camera and camera is confusing
var Camera = {};

Camera.MODE_FIRST_PERSON = 'first person';
Camera.MODE_CHASE = 'chase';
Camera.MODE_ORBIT = 'orbit';
Camera.MODE_TOP_DOWN = 'top down';
Camera.mode = Camera.MODE_FIRST_PERSON;

Camera.CHASE_DISTANCE = 220;
Camera.CHASE_HEIGHT = 80;
Camera.CHASE_ANGLE_DOWN = 10 * -TO_RADIANS;

Camera.ORBIT_DISTANCE = 600;
Camera.ORBIT_HEIGHT = 200;
Camera.ORBIT_SPEED = 0.0002;
Camera.orbitCounter = 0;

Camera.perspectiveCamera = null;
Camera.orthoCamera = null;

Camera.TOPDOWN_HEIGHT_CUTOFF = 100;
// TODO adjust viewport shape to match screen shape
Camera.TOPDOWN_VIEWPORT_SIDE = 3000;

Camera.init = function()
{
  // store a ref to the normal camera
  Camera.perspectiveCamera = camera;
  Camera.orthoCamera = new THREE.OrthographicCamera(Camera.TOPDOWN_VIEWPORT_SIDE / -2, Camera.TOPDOWN_VIEWPORT_SIDE / 2, Camera.TOPDOWN_VIEWPORT_SIDE / 2, Camera.TOPDOWN_VIEWPORT_SIDE / -2, 1, 100);

  // removed since we want the camera to move in pause mode
  //State.actors.push(Camera);

  // put ortho camera in the centre
  Camera.orthoCamera.position.set(Grid.MAX_X / 2, Camera.TOPDOWN_HEIGHT_CUTOFF, Grid.MAX_Z / 2);
  // look down
  Camera.orthoCamera.rotateOnAxis(X_AXIS, -90 * TO_RADIANS);
}

Camera.useOrbitMode = function()
{
  // external camera so let's render the player
  scene.add(Player);
  Camera.mode = Camera.MODE_ORBIT;
}

Camera.update = function(timeDeltaMillis)
{
  if (Camera.mode == Camera.MODE_TOP_DOWN)
  {
    camera = Camera.orthoCamera;
    camera.position.x = Player.position.x;
    camera.position.z = Player.position.z;
  }
  else
  {
    camera = Camera.perspectiveCamera;
  }

  if (Camera.mode == Camera.MODE_FIRST_PERSON)
  {
    camera.position.copy(Player.position);
    camera.rotation.copy(Player.rotation);
  }
  else if (Camera.mode == Camera.MODE_CHASE)
  {
    camera.position.copy(Player.position);
    camera.rotation.copy(Player.rotation);

    camera.position.y += Camera.CHASE_HEIGHT;
    // could have used translateZ() instead here I think, after a pushMatrix() - see Shot constructor
    camera.position.z += Camera.CHASE_DISTANCE * Math.cos(Player.rotation.y);
    camera.position.x += Camera.CHASE_DISTANCE * Math.sin(Player.rotation.y);

    camera.rotateOnAxis(X_AXIS, Camera.CHASE_ANGLE_DOWN);
  }
  else if (Camera.mode == Camera.MODE_ORBIT)
  {
    camera.position.copy(Player.position);
    camera.rotation.copy(Player.rotation);
    camera.position.y += Camera.ORBIT_HEIGHT;
    camera.position.z += Camera.ORBIT_DISTANCE * Math.cos(Camera.orbitCounter);
    camera.position.x += Camera.ORBIT_DISTANCE * Math.sin(Camera.orbitCounter);
    camera.lookAt(Player.position);
    Camera.orbitCounter += (Camera.ORBIT_SPEED * timeDeltaMillis);
  }
}
