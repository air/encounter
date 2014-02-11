var Enemy = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

Enemy.RADIUS = 40;
Enemy.GEOMETRY = new THREE.SphereGeometry(Enemy.RADIUS, 8, 4);
Enemy.MATERIAL = MATS.normal; // see also MATS.wireframe.clone();
Enemy.MESH_SCALE_Y = 0.4; // TODO improve UFO shape
// Player speed is currently 1.0
Enemy.MOVEMENT_SPEED = 0.8;

// state
//Enemy.lastTimeFired = 0;
//Enemy.shotsInFlight = 0;
Enemy.isAlive = false;

Enemy.spawnTimerStartedAt = null;

Enemy.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Enemy, Enemy.GEOMETRY, Enemy.MATERIAL);
  Enemy.scale.y = Enemy.MESH_SCALE_Y;
}

Enemy.startSpawnTimer = function()
{
  log('started enemy spawn timer');
  Enemy.spawnTimerStartedAt = clock.oldTime;
}

Enemy.spawnIfReady = function()
{
  if ((clock.oldTime - Enemy.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
  {
    Enemy.spawn();
    Enemy.isAlive = true;
    State.setupCombat();
  }
}

Enemy.spawn = function()
{
  log('spawning enemy');
  Enemy.position.set(Grid.MAX_X / 2, Encounter.CAMERA_HEIGHT, Grid.MAX_Z / 2);
  Enemy.position.x += 800;
  Enemy.position.z -= 800;

  scene.add(Enemy);
  actors.push(Enemy);
}

Enemy.update = function(timeDeltaMillis)
{
  Enemy.doAI(timeDeltaMillis);

  // if an obelisk is close (fast check), do a detailed collision check
  if (physics.isCloseToAnObelisk(Enemy.position, Enemy.RADIUS))
  {
    // check for precise collision
    var obelisk = physics.getCollidingObelisk(Enemy.position, Enemy.RADIUS);
    // if we get a return there is work to do
    if (typeof obelisk !== "undefined")
    {
      // we have a collision, move the Enemy out but don't change the rotation
      physics.moveCircleOutOfStaticCircle(obelisk.position, Obelisk.RADIUS, Enemy.position, Enemy.RADIUS);
      sound.playerCollideObelisk();
    }
  } 
}

Enemy.shoot = function()
{
  sound.enemyShoot();
  var shot = new Shot(Enemy);
  shot.callbackWhenDead(State.actorIsDead); // FIXME make this sane
  actors.push(shot);
  scene.add(shot);
}

Enemy.doAI = function(timeDeltaMillis)
{
  var actualMoveSpeed = timeDeltaMillis * Enemy.MOVEMENT_SPEED;
  Enemy.translateZ(-actualMoveSpeed);

  if (random(0,100) == 42)
  {
    Enemy.rotateOnAxis(Y_AXIS, Math.random());
    Enemy.shoot();
  }
}

Enemy.destroyed = function()
{
  sound.playerKilled();
  scene.remove(Enemy);
  Enemy.isAlive = false;

  var index = actors.indexOf(Enemy);
  if (index !== -1) {
    actors.splice(index, 1);
  }

  State.enemyKilled();
}