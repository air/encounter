'use strict';

// Used by Enemy.js.

var Missile = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

Missile.RADIUS = 40; // FIXME collides at this radius but doesn't appear it
Missile.GEOMETRY = new THREE.SphereGeometry(Missile.RADIUS, 4, 4);
Missile.MATERIAL =  new THREE.MeshBasicMaterial({ color: C64.cyan });
Missile.MESH_SCALE_X = 0.6; // TODO improve shape

Missile.radarType = Radar.TYPE_ENEMY;

// Player speed is Encounter.MOVEMENT_SPEED
Missile.MOVEMENT_SPEED = 1.8;

Missile.STRAFE_MAX_OFFSET = 40; // how far the missile will strafe away from a direct line to the player
Missile.STRAFE_TIME_MILLIS = 1000; // time to sweep from one side to the other

Missile.strafeOffset = null; // current offset
Missile.strafeTweenLoop = null; // keep a reference so we can start/stop on demand

Missile.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Missile, Missile.GEOMETRY, Missile.MATERIAL);
  Missile.scale.x = Missile.MESH_SCALE_X;

  Missile.setupStrafeTweens();
}

Missile.spawn = function()
{
  Indicators.setRed(true);

  var spawnPoint = Grid.randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
  spawnPoint.y = Encounter.CAMERA_HEIGHT;
  log('spawning missile at ' + spawnPoint.x + ', ' + spawnPoint.y + ', ' + spawnPoint.z);
  Missile.position.copy(spawnPoint);

  Missile.strafeOffset = -Missile.STRAFE_MAX_OFFSET; // start at one side for simplicity
  Missile.strafeTweenLoop.start();

  return this;
}

// set up an infinitely looping tween going back and forth between offsets
Missile.setupStrafeTweens = function()
{
  var leftToRight = new TWEEN.Tween(Missile).to({ strafeOffset: Missile.STRAFE_MAX_OFFSET }, Missile.STRAFE_TIME_MILLIS);
  var rightToLeft = new TWEEN.Tween(Missile).to({ strafeOffset: -Missile.STRAFE_MAX_OFFSET }, Missile.STRAFE_TIME_MILLIS);

  leftToRight.chain(rightToLeft);
  rightToLeft.chain(leftToRight);
  
  Missile.strafeTweenLoop = leftToRight;
}

Missile.update = function(timeDeltaMillis)
{
  TWEEN.update();

  Missile.translateX(Missile.strafeOffset);

  MY3.rotateObjectToLookAt(Missile, Player.position);
  
  var actualMoveSpeed = timeDeltaMillis * Missile.MOVEMENT_SPEED;
    Missile.translateZ(-actualMoveSpeed);

    // if an obelisk is close (fast check), do a detailed collision check
    if (Physics.isCloseToAnObelisk(Missile.position, Missile.RADIUS))
    {
      // check for precise collision
      var collidePosition = Physics.isCollidingWithObelisk(Missile.position, Missile.RADIUS);
      // if we get a return there is work to do
      if (typeof collidePosition !== "undefined")
      {
        // we have a collision, move the Enemy out but don't change the rotation
        Physics.moveCircleOutOfStaticCircle(collidePosition, Obelisk.RADIUS, Missile.position, Missile.RADIUS);
        Sound.playerCollideObelisk();
      }
    }

  // offset to the side
  // collide and kill the player
  if (MY3.doCirclesCollide(Missile.position, Missile.RADIUS, Player.position, Player.RADIUS))
  {
    Player.wasHit();
  }
}

Missile.destroyed = function()
{
  Indicators.setRed(false);
  Missile.strafeTweenLoop.stop();
}