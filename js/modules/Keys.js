'use strict';

// Keys.js covers the keys that are NOT associated with movement (which can change).

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
// For now, we'll define placeholder objects to maintain functionality
const State = {
  current: null,
  ATTRACT: 'attract',
  COMBAT: 'combat', 
  WAIT_FOR_ENEMY: 'wait_for_enemy',
  WARP: 'warp',
  isPaused: false,
  setupPlayerHitInCombat: () => console.log('State.setupPlayerHitInCombat called')
};

const Controls = {
  current: null,
  useFlyControls: () => console.log('Controls.useFlyControls called'),
  useEncounterControls: () => console.log('Controls.useEncounterControls called')
};

const SimpleControls = function() {}; // Placeholder constructor

const Enemy = {
  isAlive: false,
  destroyed: () => console.log('Enemy.destroyed called')
};

const Player = {
  wasHit: () => console.log('Player.wasHit called')
};

const Warp = {
  state: null,
  STATE_WAIT_TO_EXIT: 'wait_to_exit'
};

// For error logging - assuming this is from UTIL but we'll define locally for now
function error(msg) {
  console.error(msg);
}

// is the user pressing fire right now?
let shooting = false;

// has the user requested a specific level?
let levelRequested = null;

// toggle between normal and flying controls
export function switchControls() {
  if (Controls.current instanceof SimpleControls)
  {
    Controls.useFlyControls();
  }
  else
  {
    Controls.useEncounterControls();
  }
}

// handle non-repeating keypresses.
export function keyUp(event) {
  // number keys on the title screen
  if (event.keyCode >=49 && event.keyCode <= 56 && State.current === State.ATTRACT)
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