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

Warp.init = function()
{
  // TODO create asteroids

  // method:
  // Player is constantly moving.
  // Asteroids get created every N frames on a perpendicular line a set distance ahead of the player.
  // wait until end of warp then clean up all asteroids.
  // Next step: implement movement/controls with obelisks in place.
}
 
Warp.setup = function()
{
  Portal.removeFromScene();
  Ground.removeFromScene();
  //Grid.removeFromScene();
  Radar.removeFromScene();

  Player.resetPosition();
  Controls.useWarpControls();

  Warp.enteredAt = clock.oldTime;

  document.body.style.background = C64.css.black;
  // TODO add to scene
  // TODO remove up/down controls
  // TODO tween the acceleration

  Warp.state = Warp.STATE_ACCELERATE;
  log('warp: accelerating');

  // set up acceleration phase
  var tween = new TWEEN.Tween(Controls.current).to({ movementSpeed: Warp.MAX_SPEED }, Warp.TIME_ACCELERATING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function() {
    log('acceleration tween complete');
  });
  tween.start();
}

Warp.removeFromScene = function()
{
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