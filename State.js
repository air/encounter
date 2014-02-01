var State = {};

State.ATTRACT = 'attract';
State.WAIT_FOR_ENEMY = 'waitForEnemy';
State.COMBAT = 'combat';
State.WAIT_FOR_PORTAL = 'waitForPortal';
State.WARP = 'warp';
State.GAME_OVER = 'gameOver';
State.current = null;

State.worldNumber = null;
State.enemiesRemaining = null;

State.init = function()
{
  State.current = State.ATTRACT;
  State.setupAttract();
}

State.setupAttract = function()
{
  Overlay.update();
}

State.setupWaitForEnemy = function()
{
  State.worldNumber = 1;
  State.enemiesRemaining = 3;
  Overlay.update();
}

State.enemyKilled = function()
{
  State.enemiesRemaining -= 1;
  Overlay.update();
}

State.updateAttractMode = function(timeDeltaMillis)
{
  if (keys.shooting)
  {
    State.current = State.WAIT_FOR_ENEMY;
    State.setupWaitForEnemy();
  }
}

State.updateCombat = function(timeDeltaMillis)
{
  // update player if we're alive, even in pause mode (for the moment)
  if (Player.isAlive)
  {
    controls.update(timeDeltaMillis);
    Player.update(timeDeltaMillis);
  }

  // camera can move after death
  Camera.update(timeDeltaMillis);

  // update non-Player game actors
  if (!isPaused && Player.isAlive)
  {
    updateGameState(timeDeltaMillis);
    interpretKeys(timeDeltaMillis);
  }
}

function update(timeDeltaMillis)
{
  switch (State.current)
  {
    case State.ATTRACT:
      State.updateAttractMode(timeDeltaMillis);
      break;
    case State.COMBAT:
    case State.WAIT_FOR_ENEMY:
    case State.WAIT_FOR_PORTAL:
      State.updateCombat(timeDeltaMillis);
      break;
    default:
      console.error('unknown state: ', State.current);
  }
}
