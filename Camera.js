// FIXME Camera and camera is confusing
var Camera = new Object();

Camera.MODE_FIRST_PERSON = 'first person';
Camera.MODE_CHASE = 'chase';
Camera.mode = Camera.MODE_CHASE;

Camera.CHASE_DISTANCE = 220;
Camera.CHASE_HEIGHT = 80;
Camera.CHASE_ANGLE_DOWN = 10 * -TO_RADIANS;

Camera.init = function()
{
  // removed since we want the camera to move in pause mode
  //actors.push(Camera);
}

Camera.update = function(time)
{
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
}