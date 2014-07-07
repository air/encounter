'use strict';

// Used by Enemy.js.

var Saucer = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

Saucer.RADIUS = 40;
Saucer.GEOMETRY = new THREE.SphereGeometry(Saucer.RADIUS, 8, 4);
Saucer.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.yellow });
Saucer.MATERIAL_SHOT = new THREE.MeshBasicMaterial({ color: C64.yellow });
Saucer.MESH_SCALE_Y = 0.4; // TODO improve UFO shape

Saucer.radarType = Radar.TYPE_ENEMY;

// Player speed is Encounter.MOVEMENT_SPEED
Saucer.MOVEMENT_SPEED = 0.8;

Saucer.state = null;
Saucer.STATE_MOVING = 'moving';
Saucer.STATE_WAITING = 'waiting';

Saucer.movingCountdown = null;
Saucer.waitingCountdown = null;
Saucer.MOVE_TIME_MAX_MS = 5000;
Saucer.MOVE_TIME_MIN_MS = 1000;
Saucer.WAIT_TIME_MAX_MS = 2000;
Saucer.WAIT_TIME_MIN_MS = 1000;

Saucer.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Saucer, Saucer.GEOMETRY, Saucer.MATERIAL);
  Saucer.scale.y = Saucer.MESH_SCALE_Y;
}

Saucer.spawn = function()
{
  var spawnPoint = Grid.randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
  spawnPoint.y = Encounter.CAMERA_HEIGHT;
  log('spawning saucer at ' + spawnPoint.x + ', ' + spawnPoint.y + ', ' + spawnPoint.z);
  Saucer.position.copy(spawnPoint);

  Saucer.setupMoving();

  return this;
}

Saucer.setupWaiting = function()
{
  Saucer.waitingCountdown = UTIL.random(Saucer.WAIT_TIME_MIN_MS, Saucer.WAIT_TIME_MAX_MS);
  log('enemy waiting for ' + Saucer.waitingCountdown + 'ms');
  Saucer.state = Saucer.STATE_WAITING;
}

Saucer.updateWaiting = function(timeDeltaMillis)
{
  Saucer.waitingCountdown -= timeDeltaMillis;
  if (Saucer.waitingCountdown <= 0)
  {
    Saucer.setupMoving();
  }
  else
  {
    if (UTIL.random(50) == 42)
    {
      MY3.rotateObjectToLookAt(Saucer, Player.position);
      Saucer.shoot();
      Saucer.setupMoving();
    }
  }
}

Saucer.setupMoving = function()
{
  Saucer.movingCountdown = UTIL.random(Saucer.MOVE_TIME_MIN_MS, Saucer.MOVE_TIME_MAX_MS);
  Saucer.rotation.y = MY3.randomDirection();
  log('enemy moving for ' + Saucer.movingCountdown + 'ms in direction ' + Saucer.rotation.y);
  Saucer.state = Saucer.STATE_MOVING;
}

Saucer.updateMoving = function(timeDeltaMillis)
{
  Saucer.movingCountdown -= timeDeltaMillis;
  if (Saucer.movingCountdown > 0)
  {
    var actualMoveSpeed = timeDeltaMillis * Saucer.MOVEMENT_SPEED;
    Saucer.translateZ(-actualMoveSpeed);

    // if an obelisk is close (fast check), do a detailed collision check
    if (Physics.isCloseToAnObelisk(Saucer.position, Saucer.RADIUS))
    {
      // check for precise collision
      var obelisk = Physics.getCollidingObelisk(Saucer.position, Saucer.RADIUS);
      // if we get a return there is work to do
      if (typeof obelisk !== "undefined")
      {
        // we have a collision, move the Saucer out but don't change the rotation
        Physics.moveCircleOutOfStaticCircle(obelisk.position, Obelisk.RADIUS, Saucer.position, Saucer.RADIUS);
        Sound.playerCollideObelisk();
      }
    }
  }
  else
  {
    Saucer.setupWaiting();
  }
}

Saucer.update = function(timeDeltaMillis)
{
  switch(Saucer.state)
  {
    case Saucer.STATE_WAITING:
      Saucer.updateWaiting(timeDeltaMillis);
      break;
    case Saucer.STATE_MOVING:
      Saucer.updateMoving(timeDeltaMillis);
      break;
    default:
      error('unknown Saucer state: ' + Saucer.state);
  } 
}

Saucer.shoot = function()
{
  Sound.enemyShoot();
  var shot = Shot.newInstance(Saucer, Saucer.position, Saucer.rotation);
  State.actors.push(shot);
  scene.add(shot);
}
