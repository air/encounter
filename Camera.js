// FIXME Camera and camera is confusing
var Camera = new Object();

Camera.MODE_FIRST_PERSON = 'first person';
Camera.MODE_CHASE = 'chase';
Camera.MODE_ORBIT = 'orbit';
Camera.mode = Camera.MODE_CHASE;

Camera.CHASE_DISTANCE = 220;
Camera.CHASE_HEIGHT = 80;
Camera.CHASE_ANGLE_DOWN = 10 * -TO_RADIANS;

Camera.ORBIT_DISTANCE = 600;
Camera.ORBIT_HEIGHT = 200;
Camera.ORBIT_SPEED = 0.0002;
Camera.orbitCounter = 0;

Camera.init = function()
{
  // removed since we want the camera to move in pause mode
  //actors.push(Camera);
}

Camera.update = function(timeDeltaMillis)
{
  // default starting point is first person
  camera.position.copy(Player.position);
  camera.rotation.copy(Player.rotation);

  if (Camera.mode == Camera.MODE_CHASE)
  {
    camera.position.y += Camera.CHASE_HEIGHT;
    // could have used translateZ() instead here I think, after a pushMatrix() - see Shot constructor
    camera.position.z += Camera.CHASE_DISTANCE * Math.cos(Player.rotation.y);
    camera.position.x += Camera.CHASE_DISTANCE * Math.sin(Player.rotation.y);

    camera.rotateOnAxis(X_AXIS, Camera.CHASE_ANGLE_DOWN);
  }
  else if (Camera.mode == Camera.MODE_ORBIT)
  {
    camera.position.y += Camera.ORBIT_HEIGHT;
    camera.position.z += Camera.ORBIT_DISTANCE * Math.cos(Camera.orbitCounter);
    camera.position.x += Camera.ORBIT_DISTANCE * Math.sin(Camera.orbitCounter);
    camera.lookAt(Player.position);
    Camera.orbitCounter += (Camera.ORBIT_SPEED * timeDeltaMillis);
  }
}