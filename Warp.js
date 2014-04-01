var Warp = {};

Warp.TIME_ACCELERATING_MS = 9000; // measured
Warp.TIME_AT_FULL_SPEED_MS = 11000; // measured
Warp.TIME_DECELERATING_MS = 9000; // measured

Warp.state = null;
// TODO states

Warp.enteredAt = null;

Warp.init = function()
{
  document.body.style.background = C64.css.black;
  Warp.enteredAt = clock.oldTime;

  Portal.removeFromScene();
  Ground.removeFromScene();
  Grid.removeFromScene();
  Radar.removeFromScene();
}

Warp.removeFromScene = function()
{

}

Warp.update = function(timeDeltaMillis)
{
  // FIXME use timings
  if ((clock.oldTime - Warp.enteredAt) > 6000)
  {
    log('warp ended');
    Warp.state = null;

    Warp.removeFromScene();
    Warp.restoreWorld();
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