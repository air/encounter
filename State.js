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

State.isPaused = false;

State.init = function()
{
  State.setupAttract();
}

State.initWorld = function()
{
  document.body.style.background = C64.css.lightblue;
  scene.add(new THREE.AxisHelper(800));
  Ground.init();
  Grid.init();
  Player.init();
  Enemy.init();
  Camera.init();
  GUI.init();
  Controls.init();
  Radar.init();

  State.worldNumber = 1;
  State.resetEnemyCounter();
}

State.resetEnemyCounter = function()
{
  State.enemiesRemaining = 1;
}

State.setupAttract = function()
{
  State.current = State.ATTRACT;
  log(State.current);
  Overlay.update();
}

State.setupWaitForEnemy = function()
{
  State.current = State.WAIT_FOR_ENEMY;
  log(State.current);

  Overlay.update();
  Enemy.startSpawnTimer();
}

State.setupWaitForPortal = function()
{
  State.current = State.WAIT_FOR_PORTAL;
  log(State.current);

  Overlay.update();
  Portal.startSpawnTimer();
}

State.setupCombat = function()
{
  State.current = State.COMBAT;
  log(State.current);
}

State.setupGameOver = function()
{
  State.current = State.GAME_OVER;
  log(State.current);
  Camera.mode = Camera.MODE_ORBIT;
}

State.setupWarp = function()
{
  State.current = State.WARP;
  log(State.current);
  Warp.init();
}

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
}

State.updateAttractMode = function(timeDeltaMillis)
{
  if (keys.shooting)
  {
    State.initWorld();
    State.setupWaitForEnemy();
  }
}

State.updateWaitForEnemy = function(timeDeltaMillis)
{
  Controls.current.update(timeDeltaMillis);
  Player.update(timeDeltaMillis);
  Camera.update(timeDeltaMillis);

  // update non-Player game actors
  if (!State.isPaused)
  {
    State.updateActors(timeDeltaMillis);
    Controls.interpretKeys(timeDeltaMillis);
  }

  Enemy.spawnIfReady();
  Radar.update();
}

State.updateWaitForPortal = function(timeDeltaMillis)
{
  Controls.current.update(timeDeltaMillis);
  Player.update(timeDeltaMillis);
  Camera.update(timeDeltaMillis);

  // update non-Player game actors
  if (!State.isPaused)
  {
    State.updateActors(timeDeltaMillis);
    Controls.interpretKeys(timeDeltaMillis);
  }

  Portal.update(timeDeltaMillis);
  Radar.update();
}

State.updateCombat = function(timeDeltaMillis)
{
  Controls.current.update(timeDeltaMillis);
  Player.update(timeDeltaMillis);
  Camera.update(timeDeltaMillis);

  // update non-Player game actors
  if (!State.isPaused)
  {
    State.updateActors(timeDeltaMillis);
    Controls.interpretKeys(timeDeltaMillis);
  }
  Radar.update();
}

State.updateGameOver = function(timeDeltaMillis)
{
  Camera.update(timeDeltaMillis);  
}

// ask all actors to update their state based on the last time delta
State.updateActors = function(timeDeltaMillis)
{
  for (var i = 0; i < actors.length; i++) {
    actors[i].update(timeDeltaMillis);
  };
}

// called from util.js
function update(timeDeltaMillis)
{
  switch (State.current)
  {
    case State.ATTRACT:
      State.updateAttractMode(timeDeltaMillis);
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
    case State.GAME_OVER:
      State.updateGameOver(timeDeltaMillis);
      break;
    default:
      console.error('unknown state: ', State.current);
  }
}

// invoked as a callback
State.actorIsDead = function(actor)
{
  if (typeof actor === "undefined") throw('actor undefined');

  var index = actors.indexOf(actor);
  if (index !== -1) {
    actors.splice(index, 1);
  }

  Player.shotsInFlight -= 1; // FIXME not general case
  scene.remove(actor);
}