'use strict';

var Player = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

Player.RADIUS = 40;
Player.GEOMETRY = new THREE.SphereGeometry(Player.RADIUS, 8, 4);
Player.MATERIAL = MATS.wireframe.clone();
Player.SHOT_MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white });

Player.radarType = Radar.TYPE_PLAYER;

Player.lastTimeFired = null;
Player.shotsInFlight = null;
Player.shipsLeft = null;

Player.isAlive = false;
Player.timeOfDeath = null;  // timestamp when we died, for a delay before going back into game

Player.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Player, Player.GEOMETRY, Player.MATERIAL); 

  // FIXME for debug purposes player can move in pause mode - uncomment to fix this.
  //State.actors.push(playerMesh);
};

// reset everything about the player except how many lives are left.
Player.reset = function()
{
  Player.position.copy(Grid.playerStartLocation());

  Player.rotation.x = 0;
  Player.rotation.y = Encounter.PLAYER_INITIAL_ROTATION;
  Player.rotation.z = 0;

  log('reset player: position ' + Player.position.x + ', ' + Player.position.y + ', ' + Player.position.z + ' and rotation.y ' + Player.rotation.y);

  Player.shotsInFlight = 0;
  Player.lastTimeFired = 0;
  Player.isAlive = true;
};

Player.resetShipsLeft = function()
{
  Player.shipsLeft = Encounter.PLAYER_LIVES;
};

Player.update = function()
{
  // if an obelisk is close (fast check), do a detailed collision check
  if (Grid.isActive && Physics.isCloseToAnObelisk(Player.position, Player.RADIUS))
  {
    // check for precise collision
    var collidePosition = Physics.isCollidingWithObelisk(Player.position, Player.RADIUS);
    // if we get a return there is work to do
    if (typeof collidePosition !== 'undefined')
    {
      // we have a collision, move the player out but don't change the rotation
      Physics.moveCircleOutOfStaticCircle(collidePosition, Obelisk.RADIUS, Player.position, Player.RADIUS);
      Sound.playerCollideObelisk();
    }
  }
};

Player.wasHit = function()
{
  Sound.playerKilled();
  Player.isAlive = false;
  Player.timeOfDeath = clock.oldTime;
  log('player death at time ' + Player.timeOfDeath);

  if (Player.shipsLeft === 0)
  {
    State.setupGameOver();
  }
  else
  {
    Player.shipsLeft -= 1;
    State.setupPlayerHit();
  }
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
      State.actors.push(shot);
      scene.add(shot);    
    }
  }
};