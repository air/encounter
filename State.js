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

State.setupAttract = function()
{
  State.current = State.ATTRACT;
  Overlay.update();
}

State.setupWaitForEnemy = function()
{
  State.current = State.WAIT_FOR_ENEMY;
  
  scene.add(new THREE.AxisHelper(800));
  Ground.init();
  Grid.init();
  Player.init();
  Enemy.init();
  Camera.init();
  GUI.init();
  Controls.init();

  State.worldNumber = 1;
  State.enemiesRemaining = 3;
  Overlay.update();

  Enemy.startSpawnTimer();
}

State.setupCombat = function()
{
  State.current = State.COMBAT;
}

State.setupGameOver = function()
{
  State.current = State.GAME_OVER;
  Camera.mode = Camera.MODE_ORBIT;
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
    case State.WAIT_FOR_PORTAL:
      State.updateCombat(timeDeltaMillis);
      break;
    case State.WAIT_FOR_ENEMY:
      State.updateWaitForEnemy(timeDeltaMillis);
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