var Camera = new Object();

Camera.init = function()
{
  actors.push(Camera);
}

Camera.update = function(time)
{
  camera.position.copy(Player.position);
  camera.rotation.copy(Player.rotation);
}