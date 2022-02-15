import { log, error, panic } from '/js/UTIL.js';

var Controls = {};

Controls.current = null;
Controls.shootingAllowed = true;

Controls.init = function()
{
  Controls.useEncounterControls();
};

Controls.useFlyControls = function()
{
  Controls.shootingAllowed = true;
  Controls.current = new THREE.FirstPersonControls(Player);
  Controls.current.movementSpeed = 2.0;
  Controls.current.lookSpeed = 0.0001;
  Controls.current.constrainVertical = false; // default false
  Controls.current.verticalMin = 45 * UTIL.TO_RADIANS;
  Controls.current.verticalMax = 135 * UTIL.TO_RADIANS;
};

Controls.useEncounterControls = function()
{
  Controls.shootingAllowed = true;
  Controls.current = new SimpleControls(Player);
  Controls.current.movementSpeed = Encounter.MOVEMENT_SPEED;
  Controls.current.turnSpeed = Encounter.TURN_SPEED;
  Controls.current.accelerationFixed = false;
  Player.position.y = Encounter.CAMERA_HEIGHT;
  Player.rotation.x = 0;
  Player.rotation.z = 0;
};

Controls.useWarpControls = function()
{
  Controls.shootingAllowed = false;
  Controls.current = new SimpleControls(Player);
  Controls.current.movementSpeed = 0;
  Controls.current.turnSpeed = Encounter.TURN_SPEED;
  Controls.current.accelerationFixed = true;
};

Controls.interpretKeys = function(timeDeltaMillis)
{
  if (Keys.shooting && Controls.shootingAllowed)
  {
    Player.shoot();
  }
};
