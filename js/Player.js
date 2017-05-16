'use strict';

var Player = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

Player.RADIUS = 40;
Player.GEOMETRY = new THREE.SphereGeometry(Player.RADIUS, 8, 4);
Player.MATERIAL = MATS.wireframe.clone();
Player.SHOT_MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white });

Player.radarType = Radar.TYPE_PLAYER;

Player.lastTimeFired = null;
Player.shotsInFlight = null;
Player.shieldsLeft = null;

Player.isAlive = false;
Player.timeOfDeath = null;  // timestamp when we died, for a delay before going back into game

Player.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Player, Player.GEOMETRY, Player.MATERIAL); 

  // FIXME for debug purposes player can move in pause mode - uncomment to fix this.
  //State.actors.add(playerMesh);
};

Player.resetPosition = function()
{
  Player.position.copy(Grid.playerStartLocation());

  Player.rotation.x = 0;
  Player.rotation.y = Encounter.PLAYER_INITIAL_ROTATION;
  Player.rotation.z = 0;

  log('reset player: position ' + Player.position.x + ', ' + Player.position.y + ', ' + Player.position.z + ' and rotation.y ' + Player.rotation.y);
};

Player.resetShieldsLeft = function()
{
  Player.shieldsLeft = Encounter.PLAYER_LIVES;
};

Player.update = function()
{
  // if an obelisk is close (fast check), do a detailed collision check
  if (Grid.isActive && Physics.isCloseToAnObelisk(Player.position, Player.RADIUS))
  {
    // check for precise collision
    var collidePosition = Physics.isCollidingWithObelisk(Player.position, Player.RADIUS);
    // if we get a return there is work to do
    if (collidePosition)
    {
      // we have a collision, move the player out but don't change the rotation
      Physics.moveCircleOutOfStaticCircle(collidePosition, Obelisk.RADIUS, Player.position, Player.RADIUS);
      Sound.playerCollideObelisk();
    }
  }
};

// player was hit either in Warp or in combat, amend local state.
Player.wasHit = function()
{
  Sound.playerKilled();
  Player.isAlive = false;
  Player.timeOfDeath = clock.oldTime;

  Player.shotsInFlight = 0;
  Player.lastTimeFired = 0;
  log('reducing shields from ' + Player.shieldsLeft + ' to ' + (Player.shieldsLeft - 1));
  Player.shieldsLeft -= 1;
};

Player.shoot = function()
{
  if (Player.shotsInFlight < Encounter.MAX_PLAYERS_SHOTS_ALLOWED)
  {
    // FIXME use the clock
    var now = new Date().getTime();
    var timeSinceLastShot = now - Player.lastTimeFired;
    if (timeSinceLastShot > Encounter.SHOT_INTERVAL_MS)
    {
      Sound.playerShoot();
      var shot = Shot.newInstance(Player, Player.position, Player.rotation, Player.SHOT_MATERIAL);
      Player.shotsInFlight += 1;
      Player.lastTimeFired = now;
      State.actors.add(shot.actor);
    }
  }
};

Player.awardBonusShield = function()
{
  if (Player.shieldsLeft < Encounter.PLAYER_MAX_SHIELDS)
  {
    Player.shieldsLeft += 1;
  }
};