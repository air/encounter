'use strict';

// Keys.js covers the keys that are NOT associated with movement (which can change).

var Keys = {};

// is the user pressing fire right now?
Keys.shooting = false;

// has the user requested a specific level?
Keys.levelRequested = null;

// toggle between normal and flying controls
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

// handle non-repeating keypresses.
Keys.keyUp = function(event)
{
  // number keys on the title screen
  if (event.keyCode >=49 && event.keyCode <= 56 && State.current === State.ATTRACT)
  {
    Keys.levelRequested = (event.keyCode - 48);
    return;
  }

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
    case 85: // u
      if (State.current === State.COMBAT || State.current === State.WAIT_FOR_ENEMY)
      {
        error('cheat: suicide');
        Player.wasHit();
        State.setupPlayerHitInCombat();
      }
  }
};

// handle constant-state keypresses.
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
