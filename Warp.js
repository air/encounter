var Warp = {};

Warp.TIME_ACCELERATING_MS = 9000; // measured
Warp.TIME_CRUISING_MS = 11000; // measured
Warp.TIME_DECELERATING_MS = 9000; // measured

Warp.MAX_SPEED = 3.5;

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
  // TODO try different methods
  for (var i=0; i<500; i++)
  {
    var asteroid = Asteroid.newInstance();
    var location = Grid.randomLocationCloseToPlayer(100000);
    location.y = Encounter.CAMERA_HEIGHT;
    asteroid.position.copy(location);
    Warp.asteroids.push(asteroid);
  }
}
 
Warp.setup = function()
{
  Portal.removeFromScene();
  Ground.removeFromScene();
  Grid.removeFromScene();
  //Radar.removeFromScene();

  Player.resetPosition();
  Controls.useWarpControls();

  Warp.enteredAt = clock.oldTime;

  document.body.style.background = C64.css.black;

  // FIXME tidy up
  Warp.asteroids.forEach(function(asteroid) {
    scene.add(asteroid);
    actors.push(asteroid);
  });

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
}

Warp.removeFromScene = function()
{
  Warp.asteroids.forEach(function(asteroid) {
    scene.remove(asteroid);
    var index = actors.indexOf(asteroid);
    if (index !== -1) {
      actors.splice(index, 1);
    }
  });
}

Warp.update = function(timeDeltaMillis)
{
  // the update loop is the same for all states
  TWEEN.update();
  Controls.current.update(timeDeltaMillis);
  Player.update(timeDeltaMillis);
  Camera.update(timeDeltaMillis);
  State.updateActors(timeDeltaMillis);
  Controls.interpretKeys(timeDeltaMillis);
  // FIXME DEBUG ONLY
  Radar.update();

  switch (Warp.state)
  {
    case Warp.STATE_ACCELERATE:
      if ((clock.oldTime - Warp.enteredAt) > Warp.TIME_ACCELERATING_MS)
      {
        Warp.state = Warp.STATE_CRUISE;
        log('warp: cruising');
      }
      break;
    case Warp.STATE_CRUISE:
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
      Warp.removeFromScene();
      Warp.restoreWorld();
      break;
    default:
      error('unknown Warp state: ' + Warp.state);
  }
}

Warp.restoreWorld = function()
{
  Ground.addToScene();
  Grid.addToScene();
  Radar.addToScene();
  Player.resetPosition();
  Controls.useEncounterControls();
  document.body.style.background = C64.css.lightblue;

  State.resetEnemyCounter();
  State.setupWaitForEnemy();
}