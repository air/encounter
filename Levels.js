var Levels = {};

Levels.worldNumber = null;
Levels.enemiesRemaining = null;

Levels.state = null;

Levels.init = function()
{
  Levels.state = StateMachine.create({
  initial: 'attract mode',
  events: [
    { name: 'gameStarted', from: 'attract mode', to: 'setup'},
    { name: 'setupComplete', from: 'setup', to: 'wait for enemy'},
    { name: 'enemySpawned', from: 'wait for enemy', to: 'in combat'},
    { name: 'playerDiedInCombat', from: 'in combat', to: 'game over'},
    { name: 'gameOverAcknowledged', from: 'game over', to: 'attract mode'},
    { name: 'enemyDestroyed', from: 'in combat', to: 'wait for enemy'},
    { name: 'lastEnemyDestroyed', from: 'in combat', to: 'wait for portal'},
    { name: 'portalEntered', from: 'wait for portal', to: 'warp'},
    { name: 'playerDiedInWarp', from: 'warp', to: 'game over'},
    { name: 'warpCompleted', from: 'warp', to: 'wait for enemy'}
  ]});
  
  Levels.worldNumber = 1;
  Levels.enemiesRemaining = 3;
  Overlay.update();
}

Levels.enemyKilled = function()
{
  Levels.enemiesRemaining -= 1;
  Overlay.update();
}

Levels.setupAttractMode = function()
{

}

// how we update will depend on state
Levels.update = function(timeDeltaMillis)
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