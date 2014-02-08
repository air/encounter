var Portal = {};

Portal.state = null;
Portal.WAITING_TO_SPAWN = 'waitingToSpawn';
Portal.OPENING = 'opening';
Portal.WAITING_FOR_PLAYER = 'waitingForPlayer';
Portal.PLAYER_ENTERED = 'playerEntered';
Portal.CLOSING = 'closing';

Portal.TIME_TO_ANIMATE_OPENING_MS = 4000;

Portal.spawnTimerStartedAt = null;
Portal.spawnedAt = null;
Portal.wasOpenedAt = null;
Portal.closeStartedAt = null;

Portal.init = function()
{
  // no op so far
}

Portal.startSpawnTimer = function()
{
  log('started portal spawn timer');
  Portal.spawnTimerStartedAt = clock.oldTime;
  Portal.state = Portal.WAITING_TO_SPAWN;
}

Portal.spawnIfReady = function()
{
  if ((clock.oldTime - Portal.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
  {
    Portal.spawn();
    Portal.state = Portal.OPENING;
  }
}

Portal.spawn = function()
{
  log('portal spawned');
  Portal.spawnedAt = clock.oldTime;
  // TODO pick a location using a Grid helper function
}

Portal.updateOpening = function(timeDeltaMillis)
{
  // TODO animate
  if ((clock.oldTime - Portal.spawnedAt) > Portal.TIME_TO_ANIMATE_OPENING_MS)
  {
    log('portal open');
    Portal.wasOpenedAt = clock.oldTime;
    Portal.state = Portal.WAITING_FOR_PLAYER;
  }
}

Portal.updateClosing = function(timeDeltaMillis)
{
  // TODO animate
  if ((clock.oldTime - Portal.closeStartedAt) > Portal.TIME_TO_ANIMATE_OPENING_MS)
  {
    log('portal closed');
    Portal.state = null;
    State.resetEnemyCounter();
    State.setupWaitForEnemy();
  }
}

Portal.updateWaitingForPlayer = function(timeDeltaMillis)
{
  // FIXME hardcore portal entry after 5s
  if ((clock.oldTime - Portal.wasOpenedAt) > 5000)
  {
    Portal.state = Portal.PLAYER_ENTERED;
  }
  else if ((clock.oldTime - Portal.wasOpenedAt) > Encounter.TIME_TO_ENTER_PORTAL_MS)
  {
    log('player failed to enter portal, closing');
    Portal.state = Portal.CLOSING;
    Portal.closeStartedAt = clock.oldTime;
  }
}

Portal.update = function(timeDeltaMillis)
{
  switch (Portal.state)
  {
    case Portal.WAITING_TO_SPAWN:
      Portal.spawnIfReady();
      break;
    case Portal.OPENING:
      Portal.updateOpening(timeDeltaMillis);
      break;
    case Portal.WAITING_FOR_PLAYER:
      Portal.updateWaitingForPlayer(timeDeltaMillis);
      break;
    case Portal.PLAYER_ENTERED:
      Portal.state = null;
      State.setupWarp();
      break;
    case Portal.CLOSING:
      Portal.updateClosing(timeDeltaMillis);
      break;
    default:
      error('unknown Portal state: ' + Portal.state);
  }

}