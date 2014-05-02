"use strict";

// Used by Enemy.js.

var Missile = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

Missile.RADIUS = 40; // FIXME collides at this radius but doesn't appear it
Missile.GEOMETRY = new THREE.SphereGeometry(Missile.RADIUS, 8, 4);
Missile.MATERIAL = MATS.normal; // see also MATS.wireframe.clone();
Missile.MESH_SCALE_X = 0.6; // TODO improve shape

Missile.radarType = Radar.TYPE_ENEMY;

// Player speed is Encounter.MOVEMENT_SPEED
Missile.MOVEMENT_SPEED = 2;

Missile.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Missile, Missile.GEOMETRY, Missile.MATERIAL);
  Missile.scale.x = Missile.MESH_SCALE_X;
}

Missile.spawn = function()
{
  var spawnPoint = Grid.randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
  spawnPoint.y = Encounter.CAMERA_HEIGHT;
  log('spawning missile at ' + spawnPoint.x + ', ' + spawnPoint.y + ', ' + spawnPoint.z);
  Missile.position.copy(spawnPoint);

  return this;
}

Missile.update = function(timeDeltaMillis)
{
  MY3.rotateObjectToLookAt(Missile, Player.position);
  
  var actualMoveSpeed = timeDeltaMillis * Missile.MOVEMENT_SPEED;
    Missile.translateZ(-actualMoveSpeed);

    // if an obelisk is close (fast check), do a detailed collision check
    if (Physics.isCloseToAnObelisk(Missile.position, Missile.RADIUS))
    {
      // check for precise collision
      var obelisk = Physics.getCollidingObelisk(Missile.position, Missile.RADIUS);
      // if we get a return there is work to do
      if (typeof obelisk !== "undefined")
      {
        // we have a collision, move the Enemy out but don't change the rotation
        Physics.moveCircleOutOfStaticCircle(obelisk.position, Obelisk.RADIUS, Missile.position, Missile.RADIUS);
        Sound.playerCollideObelisk();
      }
    }

  // offset to the side
  // collide with player   
}
