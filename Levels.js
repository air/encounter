var Levels = {};

Levels.worldNumber = null;
Levels.enemiesRemaining = null;

Levels.state = null;

Levels.init = function()
{
  Levels.state = StateMachine.create({
    initial: 'attract',
    events: [
      { name: 'gameStarted', from: 'attract', to: 'setup'},
      { name: 'setupComplete', from: 'setup', to: 'waitForEnemy'},
      { name: 'enemySpawned', from: 'waitForEnemy', to: 'combat'},
      { name: 'playerDiedInCombat', from: 'combat', to: 'gameOver'},
      { name: 'gameOverAcknowledged', from: 'gameOver', to: 'attract'},
      { name: 'enemyDestroyed', from: 'combat', to: 'waitForEnemy'},
      { name: 'lastEnemyDestroyed', from: 'combat', to: 'waitForPortal'},
      { name: 'portalEntered', from: 'waitForPortal', to: 'warp'},
      { name: 'playerDiedInWarp', from: 'warp', to: 'gameOver'},
      { name: 'warpCompleted', from: 'warp', to: 'waitForEnemy'}
    ],
    callbacks: {
      // FIXME why can't I invoke Levels.myFunction in any callback?
      onattract: function(event, from, to) 
      {
        console.log('hello');
        Overlay.update();
      }
    }
  });
  
  Levels.worldNumber = 1;
  Levels.enemiesRemaining = 3;
}

// FIXME assign function cleanly, remove switch?
function update(timeDeltaMillis)
{
  switch (Levels.state.current)
  {
    case 'attract':
      Levels.updateLoopAttractMode(timeDeltaMillis);
      break;
    case 'combat':
      Levels.updateLoopCombat(timeDeltaMillis);
      break;
    default:
      console.error('unknown state: ', Levels.state.current);
  }
}

Levels.enemyKilled = function()
{
  Levels.enemiesRemaining -= 1;
  Overlay.update();
}

Levels.updateLoopAttractMode = function(timeDeltaMillis)
{
  if (keys.shooting)
  {
    Levels.state.gameStarted();
  }
}

Levels.updateLoopCombat = function(timeDeltaMillis)
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
