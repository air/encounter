import { log, error, panic } from '/js/UTIL.js';
import * as Actors from '/js/Actors.js'
import * as Attract from '/js/Attract.js'
import * as Grid from '/js/Grid.js'
import * as Ground from '/js/Ground.js'
import * as Sound from '/js/Sound.js'
import * as Display from '/js/Display.js'
import * as Player from '/js/Player.js'
import * as Missile from '/js/Missile.js'
import * as Camera from '/js/Camera.js'
import * as Controls from '/js/Controls.js'
import * as Touch from '/js/Touch.js'
import * as Radar from '/js/Radar.js'
import * as BlackPortal from '/js/BlackPortal.js'
import * as Warp from '/js/Warp.js'
import * as GUI from '/js/GUI.js'
import * as Indicators from '/js/Indicators.js'
import * as Explode from '/js/Explode.js'
import * as Level from '/js/Level.js'

export const ATTRACT = 'attract';
export const WAIT_FOR_ENEMY = 'waitForEnemy';
export const COMBAT = 'combat';
export const WAIT_FOR_PORTAL = 'waitForPortal';
export const WARP = 'warp';
export const PLAYER_HIT = 'playerHit';
export const GAME_OVER = 'gameOver';
export var current = null;

export var actors = new Actors.ActorList();

export var enemiesRemaining = null;

export var isPaused = false;

export var score = 0;

// called once at startup. Go into our first state
export function init()
{
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
  Warp.init();
  GUI.init(); // depends on Controls.init
  Indicators.init();
  Explode.init();
  Level.init();

  setupAttract();
};

// Setup a new combat level, either on game start or moving out of warp.
// Level number is optional; by default rely on the state in Level.
export function initLevel(levelNumber)
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
  actors.reset();

  resetEnemyCounter();
};

export function resetEnemyCounter()
{
  enemiesRemaining = Level.current.enemyCount;
};

export function setupAttract()
{
  current = ATTRACT;
  log('State: ' + current);
  Attract.show();
};

export function setupWaitForEnemy()
{
  current = WAIT_FOR_ENEMY;
  log('State: ' + current);

  Display.update();
  Enemy.startSpawnTimer();
};

export function setupWaitForPortal()
{
  current = WAIT_FOR_PORTAL;
  log('State: ' + current);

  Display.update();
  BlackPortal.startSpawnTimer();
};

export function setupCombat()
{
  current = COMBAT;
  log('State: ' + current);
};

export function setupPlayerHitInCombat()
{
  current = PLAYER_HIT;
  log('State: ' + current);

  Display.showShieldLossStatic();

  if (Player.shieldsLeft < 0)
  {
    setupGameOver();
  }
};

export function setupGameOver()
{
  current = GAME_OVER;
  log('State: ' + current);
  Display.setText('GAME OVER. PRESS FIRE');
};

export function setupWarp()
{
  current = WARP;
  log('State: ' + current);

  Warp.setup();
};

export function enemyKilled()
{
  log('enemy destroyed');
  enemiesRemaining -= 1;
  if (enemiesRemaining > 0)
  {
    setupWaitForEnemy();
  }
  else
  {
    setupWaitForPortal();
  }
};

export function updateWaitForEnemy(timeDeltaMillis)
{
  performNormalLevelUpdates(timeDeltaMillis);

  Enemy.spawnIfReady();
  Radar.update();
};

export function updateWaitForPortal(timeDeltaMillis)
{
  performNormalLevelUpdates(timeDeltaMillis);

  BlackPortal.update(timeDeltaMillis);
  Radar.update();
  TWEEN.update();
};

export function updateCombat(timeDeltaMillis)
{
  performNormalLevelUpdates(timeDeltaMillis);

  Radar.update();
  Indicators.update(); // needed for flickering effects only
  TWEEN.update(); // white portal animations
};

export function updatePlayerHitInCombat(timeDeltaMillis)
{
  Display.updateShieldLossStatic();

  if (MY3.clock.oldTime > (Player.timeOfDeath + Encounter.PLAYER_DEATH_TIMEOUT_MS))
  {
    Display.hideShieldLossStatic();
    Indicators.reset();
    actors.reset();
    Player.isAlive = true;
    setupWaitForEnemy();
  }
};

export function updateGameOver(timeDeltaMillis)
{
  if (Keys.shooting && MY3.clock.oldTime > (Player.timeOfDeath + Encounter.PLAYER_DEATH_TIMEOUT_MS))
  {
    Display.hideShieldLossStatic();
    Keys.shooting = false;
    setupAttract();
  }
};

function performNormalLevelUpdates(timeDeltaMillis)
{
  Controls.current.update(timeDeltaMillis);
  Player.update(timeDeltaMillis);
  Camera.update(timeDeltaMillis);
  Grid.update();

  // update non-Player game actors
  if (!isPaused)
  {
    actors.update(timeDeltaMillis);
    Controls.interpretKeys(timeDeltaMillis);
  }
};

// called from util.js
export function update(timeDeltaMillis)
{
  switch (current)
  {
    case ATTRACT:
      Attract.update(timeDeltaMillis);
      break;
    case COMBAT:
      updateCombat(timeDeltaMillis);
      break;
    case WAIT_FOR_PORTAL:
      updateWaitForPortal(timeDeltaMillis);
      break;
    case WAIT_FOR_ENEMY:
      updateWaitForEnemy(timeDeltaMillis);
      break;
    case WARP:
      Warp.update(timeDeltaMillis);
      break;
    case PLAYER_HIT:
      updatePlayerHitInCombat(timeDeltaMillis);
      break;
    case GAME_OVER:
      updateGameOver(timeDeltaMillis);
      break;
    default:
      panic('unknown state: ', current);
  }
}
