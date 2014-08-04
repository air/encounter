'use strict';

// Keys.js covers the keys that are NOT associated with movement (which can change).

var Keys = {};

Keys.shooting = false;

Keys.switchControls = function()
{
  if (Controls.current instanceof SimpleControls)
  {
    Controls.useFlyControls();
  }
  else
  {
    Controls.useEncounterControls();
  }
};

Keys.keyUp = function(event)
{
  switch(event.keyCode)
  {
    case 67: // c
      Keys.switchControls();
      break;
    case 32: // space
    case 90: // z
      Keys.shooting = false;
      break;
    case 80: // p
      State.isPaused = !State.isPaused;
      break;
    case 75: // k
      if (State.current === State.COMBAT && Enemy.isAlive)
      {
        Enemy.destroyed();
        error('cheat: killer!');
      }
      else if (State.current === State.WARP)
      {
        Warp.state = Warp.STATE_WAIT_TO_EXIT;
        error('cheat: skipper!');
      }
      break;
  }
};

Keys.keyDown = function(event)
{
  switch(event.keyCode)
  {
    case 32: // space
    case 90: // z
      Keys.shooting = true;
      break;
  }
};

document.addEventListener('keydown', Keys.keyDown.bind(this), false);
document.addEventListener('keyup', Keys.keyUp.bind(this), false);
