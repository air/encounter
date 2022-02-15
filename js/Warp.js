import { log, error, panic } from '/js/UTIL.js';

var Warp = {};

Warp.TIME_ACCELERATING_MS = 9000; // measured
Warp.TIME_CRUISING_MS = 11000; // measured
Warp.TIME_DECELERATING_MS = 9000; // measured

Warp.MAX_SPEED = 6.0;

Warp.state = null;
Warp.STATE_ACCELERATE = 'accelerate';
Warp.STATE_CRUISE = 'cruise';
Warp.STATE_DECELERATE = 'decelerate';
Warp.STATE_PLAYER_HIT = 'playerHit';
Warp.STATE_WAIT_TO_EXIT = 'waitToExit';

Warp.enteredAt = null;

// asteroid references for cleanup
Warp.asteroids = [];

Warp.init = function()
{
  // no op since asteroids are created at runtime now
};

Warp.setup = function()
{
  // remove selected elements from the display
  BlackPortal.removeFromScene();
  Grid.removeFromScene();
  Display.setSkyColour(C64.css.black);
  Display.horizonDiv.style.display = 'none';

  State.actors.reset();
  Controls.useWarpControls();

  Warp.enteredAt = MY3.clock.oldTime;

  Warp.state = Warp.STATE_ACCELERATE;
  log('warp: accelerating');

  // set up acceleration phase
  var tween = new TWEEN.Tween(Controls.current).to({ movementSpeed: Warp.MAX_SPEED }, Warp.TIME_ACCELERATING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function()
  {
    log('acceleration tween complete');
  });
  tween.start();
};

Warp.removeAsteroidsFromScene = function()
{
  Warp.asteroids.forEach(function(asteroid) {
    scene.remove(asteroid);
  });
  // forget this round's asteroids
  Warp.asteroids = [];
};

Warp.createAsteroidsInFrontOfPlayer = function(timeDeltaMillis)
{
  // TODO set ASTEROIDS_CREATED_PER_SECOND and tween it according to phase
  // otherwise we are 1. more dense when going slow and 2. FPS will affect difficulty
  var asteroid = Asteroid.newInstance();
  asteroid.position.copy(Player.position);
  asteroid.rotation.copy(Player.rotation);
  asteroid.translateZ(-15000); // FIXME adjust this
  asteroid.translateX(UTIL.random(-15000, 15000)); // FIXME adjust this
  scene.add(asteroid);
  Warp.asteroids.push(asteroid);
};

Warp.removeAsteroidsBehindPlayer = function(timeDeltaMillis)
{
  // TODO
  return false;
};

Warp.checkCollisions = function()
{
  Warp.asteroids.forEach(function(asteroid) {
    Asteroid.collideWithPlayer(asteroid.position);
  });
};

Warp.updateMovement = function(timeDeltaMillis)
{
  TWEEN.update();
  Controls.current.update(timeDeltaMillis);
  Player.update(timeDeltaMillis);
  Camera.update(timeDeltaMillis);
  Controls.interpretKeys(timeDeltaMillis);
  Warp.checkCollisions();
  // no need to update State.actors, we're just Player and Asteroids
};

Warp.update = function(timeDeltaMillis)
{
  switch (Warp.state)
  {
    case Warp.STATE_ACCELERATE:
      Warp.updateAccelerate(timeDeltaMillis);
      break;
    case Warp.STATE_CRUISE:
      Warp.updateCruise(timeDeltaMillis);
      break;
    case Warp.STATE_DECELERATE:
      Warp.updateDecelerate(timeDeltaMillis);
      break;
    case Warp.STATE_WAIT_TO_EXIT:
      Warp.updateWaitToExit(timeDeltaMillis);
      break;
    case Warp.STATE_PLAYER_HIT:
      Warp.updatePlayerHit();
      break;
    default:
      panic('unknown Warp state: ' + Warp.state);
  }
};

Warp.updateAccelerate = function(timeDeltaMillis)
{
  Warp.updateMovement(timeDeltaMillis);
  Warp.createAsteroidsInFrontOfPlayer(timeDeltaMillis);

  if ((MY3.clock.oldTime - Warp.enteredAt) > Warp.TIME_ACCELERATING_MS)
  {
    Warp.state = Warp.STATE_CRUISE;
    log('warp: cruising');
  }
};

Warp.updateCruise = function(timeDeltaMillis)
{
  Warp.updateMovement(timeDeltaMillis);
  Warp.createAsteroidsInFrontOfPlayer(timeDeltaMillis);

  if ((MY3.clock.oldTime - Warp.enteredAt - Warp.TIME_ACCELERATING_MS) > Warp.TIME_CRUISING_MS)
  {
    Warp.state = Warp.STATE_DECELERATE;
    log('warp: decelerating');

    var tween = new TWEEN.Tween(Controls.current).to({ movementSpeed: 0 }, Warp.TIME_DECELERATING_MS);
    //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
    tween.onComplete(function()
    {
      log('acceleration tween complete');
    });
    tween.start();
  }
};

Warp.updateDecelerate = function(timeDeltaMillis)
{
  Warp.updateMovement(timeDeltaMillis);
  // don't create new asteroids in deceleration phase

  if ((MY3.clock.oldTime - Warp.enteredAt - Warp.TIME_ACCELERATING_MS - Warp.TIME_CRUISING_MS) > Warp.TIME_DECELERATING_MS)
  {
    Warp.state = Warp.STATE_WAIT_TO_EXIT;
    log('warp: waiting to exit');
  }
};

// if shields are gone then game over; else play the death animation and return to previous level.
Warp.updatePlayerHit = function()
{
  Display.updateShieldLossStatic();

  if (Player.shieldsLeft < 0)
  {
    Warp.state = null;
    Warp.removeAsteroidsFromScene();  // FIXME asteroids disappear, will be replaced by death fuzz
    State.setupGameOver();
  }
  else if (MY3.clock.oldTime > (Player.timeOfDeath + Encounter.PLAYER_DEATH_TIMEOUT_MS))
  {
    Keys.shooting = false;
    Player.isAlive = true;
    Warp.restoreLevel();
  }
};

Warp.updateWaitToExit = function(timeDeltaMillis)
{
  // TODO proper warp exit
  log('warp ended successfully');
  Level.nextLevel();
  Player.awardBonusShield();

  Warp.state = null;
  Warp.restoreLevel();
};

Warp.restoreLevel = function()
{
  Warp.removeAsteroidsFromScene();

  State.initLevel();  // does all the heavy lifting of state reset

  // restore the elements we selectively hid earlier
  Display.horizonDiv.style.display = 'block';
  Grid.addToScene();

  State.setupWaitForEnemy();
};
