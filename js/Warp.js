'use strict';

var Warp = {};

Warp.TIME_ACCELERATING_MS = 9000; // measured
Warp.TIME_CRUISING_MS = 11000; // measured
Warp.TIME_DECELERATING_MS = 9000; // measured

Warp.MAX_SPEED = 6.0;

Warp.state = null;
Warp.STATE_ACCELERATE = 'accelerate';
Warp.STATE_CRUISE = 'cruise';
Warp.STATE_DECELERATE = 'decelerate';
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
  Portal.removeFromScene();
  Grid.removeFromScene();
  Radar.removeFromScene();
  Indicators.removeFromScene();

  Player.reset();
  Controls.useWarpControls();

  Warp.enteredAt = clock.oldTime;

  document.body.style.background = C64.css.black;

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

Warp.removeFromScene = function()
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

Warp.update = function(timeDeltaMillis)
{
  // the update loop is the same for all states
  TWEEN.update();
  Controls.current.update(timeDeltaMillis);
  Player.update(timeDeltaMillis);
  Camera.update(timeDeltaMillis);
  Controls.interpretKeys(timeDeltaMillis);
  Warp.checkCollisions();
  // no need to update State.actors, we're just Player and Asteroids

  switch (Warp.state)
  {
    case Warp.STATE_ACCELERATE:
      // keep things interesting
      Warp.createAsteroidsInFrontOfPlayer(timeDeltaMillis);
      if ((clock.oldTime - Warp.enteredAt) > Warp.TIME_ACCELERATING_MS)
      {
        Warp.state = Warp.STATE_CRUISE;
        log('warp: cruising');
      }
      break;
    case Warp.STATE_CRUISE:
      // keep things interesting
      Warp.createAsteroidsInFrontOfPlayer(timeDeltaMillis);
      if ((clock.oldTime - Warp.enteredAt - Warp.TIME_ACCELERATING_MS) > Warp.TIME_CRUISING_MS)
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
      break;
    case Warp.STATE_DECELERATE:
      // don't create new asteroids in deceleration phase
      if ((clock.oldTime - Warp.enteredAt - Warp.TIME_ACCELERATING_MS - Warp.TIME_CRUISING_MS) > Warp.TIME_DECELERATING_MS)
      {
        Warp.state = Warp.STATE_WAIT_TO_EXIT;
        log('warp: waiting to exit');
      }
      break;
    case Warp.STATE_WAIT_TO_EXIT:
      // TODO proper warp exit
      log('warp ended');
      Warp.state = null;
      Warp.restoreLevel();
      break;
    default:
      error('unknown Warp state: ' + Warp.state);
  }
};

Warp.restoreLevel = function()
{
  Warp.removeFromScene();

  Level.nextLevel();
  State.initLevel();

  Grid.addToScene();
  Radar.addToScene();
  Indicators.addToScene();

  State.setupWaitForEnemy();
};