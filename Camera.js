var Camera = new Object();

Camera.init = function()
{
  // removed since we want the camera to move in pause mode
  //actors.push(Camera);
}

Camera.update = function(time)
{
  camera.position.copy(Player.position);
  camera.rotation.copy(Player.rotation);
}