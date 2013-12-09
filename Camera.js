var Camera = new Object();

Camera.MODE_FIRST_PERSON = 'first person';
Camera.MODE_CHASE = 'chase';
Camera.mode = Camera.MODE_CHASE;

Camera.CHASE_Z_OFFSET = 220;
Camera.CHASE_Y_OFFSET = 80;
Camera.CHASE_ANGLE_DOWN = 20 * TO_RADIANS; // TODO angle down a bit

Camera.init = function()
{
  // removed since we want the camera to move in pause mode
  //actors.push(Camera);
}

Camera.update = function(time)
{
  camera.position.copy(Player.position);
  if (Camera.mode == Camera.MODE_CHASE)
  {
    camera.position.y += Camera.CHASE_Y_OFFSET;
    camera.position.z += Camera.CHASE_Z_OFFSET * Math.cos(Player.rotation.y);
    camera.position.x += Camera.CHASE_Z_OFFSET * Math.sin(Player.rotation.y);
  }
  camera.rotation.copy(Player.rotation);
}