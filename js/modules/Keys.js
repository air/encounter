'use strict';

// Keys.js covers the keys that are NOT associated with movement (which can change).

import { error } from './UTIL.js';
import { current as Controls_current, useFlyControls, useEncounterControls } from './Controls.js';
import SimpleControls from './SimpleControls.js';
import { getIsAlive as Enemy_getIsAlive, destroyed as Enemy_destroyed } from './Enemy.js';
import { STATE_WAIT_TO_EXIT as Warp_STATE_WAIT_TO_EXIT, setState as Warp_setState } from './Warp.js';
import { getCurrent, ATTRACT, COMBAT, WAIT_FOR_ENEMY, WARP, getIsPaused, setIsPaused, setupPlayerHitInCombat } from './State.js';
import { wasHit as Player_wasHit } from './Player.js';

// is the user pressing fire right now?
let shooting = false;

// has the user requested a specific level?
let levelRequested = null;

// toggle between normal and flying controls
export function switchControls() {
  if (Controls_current instanceof SimpleControls)
  {
    useFlyControls();
  }
  else
  {
    useEncounterControls();
  }
}

// handle non-repeating keypresses.
export function keyUp(event) {
  // number keys on the title screen
  if (event.keyCode >=49 && event.keyCode <= 56 && getCurrent() === ATTRACT)
  {
    levelRequested = (event.keyCode - 48);
    return;
  }

  switch(event.keyCode)
  {
    case 67: // c
      switchControls();
      break;
    case 32: // space
    case 90: // z
      shooting = false;
      break;
    case 80: // p
      setIsPaused(!getIsPaused());
      break;
    case 75: // k
      if (getCurrent() === COMBAT && Enemy_getIsAlive())
      {
        Enemy_destroyed();
        error('cheat: killer!');
      }
      else if (getCurrent() === WARP)
      {
        Warp_setState(Warp_STATE_WAIT_TO_EXIT);
        error('cheat: skipper!');
      }
      break;
    case 85: // u
      if (getCurrent() === COMBAT || getCurrent() === WAIT_FOR_ENEMY)
      {
        error('cheat: suicide');
        Player_wasHit();
        setupPlayerHitInCombat();
      }
  }
}

// handle constant-state keypresses.
export function keyDown(event) {
  switch(event.keyCode)
  {
    case 32: // space
    case 90: // z
      shooting = true;
      break;
  }
}

export function getShooting() {
  return shooting;
}

export function setShooting(value) {
  shooting = value;
}

export function getLevelRequested() {
  return levelRequested;
}

export function setLevelRequested(value) {
  levelRequested = value;
}

// Initialize event listeners
export function init() {
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
}

// Export default object for backward compatibility
export default {
  shooting: () => shooting,
  levelRequested: () => levelRequested,
  switchControls,
  keyUp,
  keyDown,
  getShooting,
  setShooting,
  getLevelRequested,
  setLevelRequested,
  init
};