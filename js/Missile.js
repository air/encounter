"use strict";

var Missile = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

Missile.RADIUS = 40; // FIXME collides at this radius but doesn't appear it
Missile.GEOMETRY = new THREE.SphereGeometry(Missile.RADIUS, 8, 4);
Missile.MATERIAL = MATS.normal; // see also MATS.wireframe.clone();
Missile.MESH_SCALE_X = 0.4; // TODO improve shape

// Player speed is Encounter.MOVEMENT_SPEED
Missile.MOVEMENT_SPEED = 3;

Missile.isAlive = false;

Missile.spawnTimerStartedAt = null;

Missile.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Missile, Missile.GEOMETRY, Missile.MATERIAL);
  Missile.scale.x = Missile.MESH_SCALE_X;
}

Missile.startSpawnTimer = function()
{
  log('started missile spawn timer');
  Missile.spawnTimerStartedAt = clock.oldTime;
}

Missile.spawnIfReady = function()
{
  if ((clock.oldTime - Missile.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
  {
    Missile.spawn();
    State.setupCombat();
  }
}

Missile.spawn = function()
{
  var spawnPoint = Grid.randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
  spawnPoint.y = Encounter.CAMERA_HEIGHT;
  log('spawning missile at ' + spawnPoint.x + ', ' + spawnPoint.y + ', ' + spawnPoint.z);
  Missile.position.copy(spawnPoint);

  scene.add(Missile);
  State.actors.push(Missile);
  Missile.isAlive = true;
}

Missile.update = function(timeDeltaMillis)
{
  // look at player
  // move forward
  // offset to the side
  // collide with obelisks
  // collide with player   
}

Missile.destroyed = function()
{
  Sound.playerKilled();
  scene.remove(Missile);
  Missile.isAlive = false;

  State.actorIsDead(Missile);
  State.enemyKilled();
}
