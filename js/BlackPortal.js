'use strict';

var BlackPortal = Object.create(Portal);

BlackPortal.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.black });

// additional states for black portals
BlackPortal.STATE_WAITING_TO_SPAWN = 'waitingToSpawn';
BlackPortal.STATE_WAITING_FOR_PLAYER = 'waitingForPlayer';
BlackPortal.STATE_PLAYER_ENTERED = 'playerEntered';

// additional state for black portals
BlackPortal.wasOpenedAt = null;
BlackPortal.spawnTimerStartedAt = null;

BlackPortal.init = function()
{
  BlackPortal.mesh = new THREE.Mesh(BlackPortal.GEOMETRY, BlackPortal.MATERIAL);
};

// dummy actor update, we handle updates as a top-level State
BlackPortal.getActorUpdateFunction = function()
{
  var update = function(){};
  return update;
};

BlackPortal.startSpawnTimer = function()
{
  log('started portal spawn timer');
  BlackPortal.spawnTimerStartedAt = clock.oldTime;
  BlackPortal.state = BlackPortal.STATE_WAITING_TO_SPAWN;
};

BlackPortal.spawnIfReady = function()
{
  if ((clock.oldTime - BlackPortal.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
  {
    var location = Grid.randomLocationCloseToPlayer(Encounter.PORTAL_SPAWN_DISTANCE_MAX);
    BlackPortal.spawn(location);
  }
};

BlackPortal.updateWaitingForPlayer = function(timeDeltaMillis)
{
  if (Player.position.distanceTo(BlackPortal.mesh.position) < 70)
  {
    BlackPortal.state = BlackPortal.STATE_PLAYER_ENTERED;
    // Portal cleanup is done in Warp
  }
  else if ((clock.oldTime - BlackPortal.wasOpenedAt) > Encounter.TIME_TO_ENTER_PORTAL_MS)
  {
    log('player failed to enter portal, closing');
    BlackPortal.startClosing();
  }
};

BlackPortal.opened = function()
{
  BlackPortal.wasOpenedAt = clock.oldTime;
  BlackPortal.state = BlackPortal.STATE_WAITING_FOR_PLAYER;
};

BlackPortal.closed = function()
{
  State.resetEnemyCounter();
  State.setupWaitForEnemy();
};

BlackPortal.update = function(timeDeltaMillis)
{
  switch (BlackPortal.state)
  {
    case BlackPortal.STATE_WAITING_TO_SPAWN:
      BlackPortal.spawnIfReady();
      break;
    case BlackPortal.STATE_OPENING:
      BlackPortal.updateOpening(timeDeltaMillis);
      break;
    case BlackPortal.STATE_WAITING_FOR_PLAYER:
      BlackPortal.updateWaitingForPlayer(timeDeltaMillis);
      break;
    case BlackPortal.STATE_PLAYER_ENTERED:
      BlackPortal.state = null; // lifecycle of this portal is over, despite being open
      State.setupWarp();
      break;
    case BlackPortal.STATE_CLOSING:
      BlackPortal.updateClosing(timeDeltaMillis);
      break;
    default:
      panic('unknown BlackPortal state: ' + BlackPortal.state);
  }
};
