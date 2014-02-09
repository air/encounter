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
  if ((clock.oldTime - Warp.enteredAt) > 10000)
  {
    log('warp ended');
    Warp.state = null;
    State.resetEnemyCounter();
    State.setupWaitForEnemy();
    // FIXME
    scene.remove(Portal.mesh);
    var index = actors.indexOf(Portal.mesh);
    if (index !== -1) {
      actors.splice(index, 1);
    }
    // END FIXME
    document.body.style.background = C64.css.lightblue;
  }
}