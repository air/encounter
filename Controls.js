Controls = {};

Controls.current = null;

Controls.init = function()
{
  Controls.useEncounterControls();
}

Controls.useFlyControls = function()
{
  Controls.current = new THREE.FirstPersonControls(Player);
  Controls.current.movementSpeed = 2.0;
  Controls.current.lookSpeed = 0.0001;
  Controls.current.constrainVertical = false; // default false
  Controls.current.verticalMin = 45 * TO_RADIANS;
  Controls.current.verticalMax = 135 * TO_RADIANS;
}

Controls.useEncounterControls = function()
{
  Controls.current = new SimpleControls(Player);
  Controls.current.movementSpeed = ENCOUNTER.MOVEMENT_SPEED;
  Controls.current.turnSpeed = ENCOUNTER.TURN_SPEED;
  Player.position.y = ENCOUNTER.CAMERA_HEIGHT;
  Player.rotation.x = 0;
  Player.rotation.z = 0;
}

Controls.interpretKeys = function(timeDeltaMillis)
{
  if (keys.shooting)
  {
    Player.shoot();
  }
}
