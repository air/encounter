var Warp = {};

Warp.TIME_ACCELERATING_MS = 9000; // measured
Warp.TIME_CRUISING_MS = 11000; // measured
Warp.TIME_DECELERATING_MS = 9000; // measured

Warp.state = null;
Warp.STATE_ACCELERATE = 'accelerate';
Warp.STATE_CRUISE = 'cruise';
Warp.STATE_DECELERATE = 'decelerate';
Warp.STATE_WAIT_TO_EXIT = 'waitToExit';

Warp.enteredAt = null;

Warp.init = function()
{
  // TODO create asteroids
}
 
Warp.setup = function()
{
  Portal.removeFromScene();
  Ground.removeFromScene();
  Grid.removeFromScene();
  Radar.removeFromScene();

  Warp.enteredAt = clock.oldTime;

  document.body.style.background = C64.css.black;
  // TODO add to scene
  // TODO remove up/down controls
  // TODO tween the acceleration

  Warp.state = Warp.STATE_ACCELERATE;
  log('warp: accelerating');
}

Warp.removeFromScene = function()
{
}

Warp.update = function(timeDeltaMillis)
{
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
      // FIXME
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
  document.body.style.background = C64.css.lightblue;

  State.resetEnemyCounter();
  State.setupWaitForEnemy();
}