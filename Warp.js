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
}

Warp.update = function(timeDeltaMillis)
{
  // FIXME end warp after 5s
  if ((clock.oldTime - Warp.enteredAt) > 5000)
  {
    log('warp ended');
    Warp.state = null;
    State.resetEnemyCounter();
    State.setupWaitForEnemy();
  }
}