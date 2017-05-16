'use strict';

var State = {};

State.ATTRACT = 'attract';
State.WAIT_FOR_ENEMY = 'waitForEnemy';
State.COMBAT = 'combat';
State.WAIT_FOR_PORTAL = 'waitForPortal';
State.WARP = 'warp';
State.PLAYER_HIT = 'playerHit';
State.GAME_OVER = 'gameOver';
State.current = null;

State.actors = new Actors();

State.enemiesRemaining = null;

State.isPaused = false;

State.score = 0;

// called once at startup. Go into our first state
State.init = function()
{
  Attract.init();
  Grid.init();  // reads the camera draw distance and sizes the Grid.viewport
  Ground.init();
  Sound.init();
  Display.init();
  Player.init();
  Missile.init();
  Camera.init();
  Controls.init();
  Touch.init(); // FIXME depends on Controls.init
  Radar.init();
  Portal.init();
  WhitePortal.init();
  BlackPortal.init();
  Warp.init();
  GUI.init(); // depends on Controls.init
  Indicators.init();
  Explode.init();
  Level.init();

  State.setupAttract();
};

// Setup a new combat level, either on game start or moving out of warp.
// Level number is optional; by default rely on the state in Level.
State.initLevel = function(levelNumber)
{
  if (levelNumber)
  {
    Level.set(levelNumber);
  }

  log('initialising level ' + Level.number);
  Display.setSkyColour(Level.current.skyColor);
  Display.setHorizonColour(Level.current.horizonColor);

  Camera.useFirstPersonMode();
  Controls.useEncounterControls();
  Player.resetPosition();
  Grid.reset();
  Enemy.reset();
  Indicators.reset();
  State.actors.reset();

  State.resetEnemyCounter();
};

State.resetEnemyCounter = function()
{
  State.enemiesRemaining = Level.current.enemyCount;
};

State.setupAttract = function()
{
  State.current = State.ATTRACT;
  log('State: ' + State.current);
  Attract.show();
};

State.setupWaitForEnemy = function()
{
  State.current = State.WAIT_FOR_ENEMY;
  log('State: ' + State.current);

  Display.update();
  Enemy.startSpawnTimer();
};

State.setupWaitForPortal = function()
{
  State.current = State.WAIT_FOR_PORTAL;
  log('State: ' + State.current);

  Display.update();
  BlackPortal.startSpawnTimer();
};

State.setupCombat = function()
{
  State.current = State.COMBAT;
  log('State: ' + State.current);
};

State.setupPlayerHitInCombat = function()
{
  State.current = State.PLAYER_HIT;
  log('State: ' + State.current);

  Display.showShieldLossStatic();

  if (Player.shieldsLeft < 0)
  {
    State.setupGameOver();
  }
};

State.setupGameOver = function()
{
  State.current = State.GAME_OVER;
  log('State: ' + State.current);
  Display.setText('GAME OVER. PRESS FIRE');
};

State.setupWarp = function()
{
  State.current = State.WARP;
  log('State: ' + State.current);

  Warp.setup();
};

State.enemyKilled = function()
{
  log('enemy destroyed');
  State.enemiesRemaining -= 1;
  if (State.enemiesRemaining > 0)
  {
    State.setupWaitForEnemy();
  }
  else
  {
    State.setupWaitForPortal();
  }
};

State.updateWaitForEnemy = function(timeDeltaMillis)
{
  State.performNormalLevelUpdates(timeDeltaMillis);

  Enemy.spawnIfReady();
  Radar.update();
};

State.updateWaitForPortal = function(timeDeltaMillis)
{
  State.performNormalLevelUpdates(timeDeltaMillis);

  BlackPortal.update(timeDeltaMillis);
  Radar.update();
  TWEEN.update();
};

State.updateCombat = function(timeDeltaMillis)
{
  State.performNormalLevelUpdates(timeDeltaMillis);

  Radar.update();
  Indicators.update(); // needed for flickering effects only
  TWEEN.update(); // white portal animations
};

State.updatePlayerHitInCombat = function(timeDeltaMillis)
{
  Display.updateShieldLossStatic();

  if (clock.oldTime > (Player.timeOfDeath + Encounter.PLAYER_DEATH_TIMEOUT_MS))
  {
    Display.hideShieldLossStatic();
    Indicators.reset();
    State.actors.reset();
    Player.isAlive = true;
    State.setupWaitForEnemy();
  }
};

State.updateGameOver = function(timeDeltaMillis)
{
  if (Keys.shooting && clock.oldTime > (Player.timeOfDeath + Encounter.PLAYER_DEATH_TIMEOUT_MS))
  {
    Display.hideShieldLossStatic();
    Keys.shooting = false;
    State.setupAttract();
  }
};

State.performNormalLevelUpdates = function(timeDeltaMillis)
{
  Controls.current.update(timeDeltaMillis);
  Player.update(timeDeltaMillis);
  Camera.update(timeDeltaMillis);
  Grid.update();

  // update non-Player game State.actors
  if (!State.isPaused)
  {
    State.actors.update(timeDeltaMillis);
    Controls.interpretKeys(timeDeltaMillis);
  }
};

// called from util.js
function update(timeDeltaMillis)
{
  switch (State.current)
  {
    case State.ATTRACT:
      Attract.update(timeDeltaMillis);
      break;
    case State.COMBAT:
      State.updateCombat(timeDeltaMillis);
      break;
    case State.WAIT_FOR_PORTAL:
      State.updateWaitForPortal(timeDeltaMillis);
      break;
    case State.WAIT_FOR_ENEMY:
      State.updateWaitForEnemy(timeDeltaMillis);
      break;
    case State.WARP:
      Warp.update(timeDeltaMillis);
      break;
    case State.PLAYER_HIT:
      State.updatePlayerHitInCombat(timeDeltaMillis);
      break;
    case State.GAME_OVER:
      State.updateGameOver(timeDeltaMillis);
      break;
    default:
      panic('unknown state: ', State.current);
  }
}
